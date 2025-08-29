/**
 * row controller
 */

import { factories } from '@strapi/strapi'
import jwt from 'jsonwebtoken';
import * as fse from 'fs-extra';
const optionsToOmit = ["", '-', 'N/A', 'n/a', 'NA', 'na', 'None', 'none', 'null', 'Null', 'NULL', 'nil', 'Nil', 'NIL', 'undefined', 'Undefined', 'UNDEFINED', 'unknown', 'Unknown', 'UNKNOWN', 'TBD', 'tbd', 'To be determined', 'to be determined', 'TobeDetermined', 'tobedetermined', 'TobeDetermined', 'tobedetermined']
import path from 'path';

const SearchDatabase = async (ctx: any, limited = false) => {
  // TIER-SETTINGS: this controller is expected to be called after the rate-limit middleware and the tier-check middleware for authenticated users
  // TIER-SETTINGS: allowSearch, allowedDataColumns, maxRecords, allowExport
  if (!limited && !ctx.state.tierSettings) {
    return ctx.unauthorized('Search not allowed for your subscription tier');
  }

  const data = ctx.request.body;
  const searchTerm = data.searchTerm ? data.searchTerm.toLowerCase().trim() : '';
  const sorting = data.sorting || [];
  const maxRecord = ctx.state.tierSettings.maxRecords || 0; // Added maxRecord from request body

  let whereClause = [];
  let sortClause: any = {};
  let limitClause: any = {};

  // Convert sorting to Strapi format
  if (sorting.length > 0) {
    sortClause = sorting.reduce((acc, sort) => {
      acc[`header.headername.${sort.id}`] = sort.desc ? 'desc' : 'asc';
      return acc;
    }, {});
  }

  // Convert filteredOptions to a format suitable for Strapi filters
  const filteredOptions = data.filteredOptions || {};

  for (let key in filteredOptions) {
    if (filteredOptions[key]) {
      whereClause.push({ header: { headername: key, value: { $containsi: filteredOptions[key].toLowerCase().trim() } } });
    }
  }

  // Add search term filter
  if (searchTerm) {
    whereClause.push({
      header: {
        value: {
          $containsi: searchTerm
        }
      }
    });
  }

  // Step 1: Build the query parameters
  const queryParameters = {
    page: data.page || 1,
    pageSize: limited ? 3 : (data.pageSize || 10),
    filters: whereClause.length > 1 ? { $and: whereClause } : whereClause[0],
    sort: sortClause,
    populate: {
      header: {
        fields: ['headername', 'value']
      }
    },
  };

  // Step 2: Apply maxRecord limit (if set)
  if (maxRecord > 0) {
    // Use a subquery to fetch the first `n` records based on insertion order
    const firstNRecords = await strapi.db.query('api::database.database').findOne({
      orderBy: { createdAt: 'asc' }, // Use `createdAt` or another column representing insertion order
      select: ['id'], // Only fetch IDs to avoid loading large datasets into memory
    });

    // Extract the IDs of the first `n` records
    const firstNRecordIds = firstNRecords.id + maxRecord;

    // Add a filter to the main query to include only these IDs
    queryParameters.filters = {
      $and: [
        ...(queryParameters.filters ? [queryParameters.filters] : []),
        {
          id: {
            $lte: firstNRecordIds, // Filter by the IDs of the first `n` records
          },
        },
      ],
    };
  }

  // Fetch the results from the database
  const results = await strapi.entityService?.findPage("api::database.database", queryParameters);

  // TIER-SETTINGS: allowedDataColumn
  // Filter the results based on allowed data columns
  let allowedHeaders = ['*'];
  if (Object.keys(ctx.state.tierSettings || {}).length > 0) {
    allowedHeaders = ctx.state.tierSettings.allowedDataColumns || ['*'];
  }

  const sanitizedResults = results?.results.map(({ header }) => ({
    header: header.map(({ headername, value }) => ({ headername, value })).filter(({ headername }) => {
      if (allowedHeaders.includes('*')) {
        return true;
      }
      if (allowedHeaders.includes(headername)) {
        return true;
      }
      return false;
    })
  }));

  // Fetch filter options
  const filterOptions = await strapi.db?.query('api::filteroption.filteroption').findOne({
    where: { title: 'filterings' },
  });

  // Get the total number of entries in the database
  let totalEntriesInDatabase = await strapi.entityService?.count('api::database.database');

  // TIER-SETTINGS: maxRecord
  // If maxRecord is set, adjust the total entries count to not exceed maxRecord
  if (maxRecord > 0) {
    totalEntriesInDatabase = Math.min(totalEntriesInDatabase, maxRecord);
  }

  return ctx.send({
    message: 'success',
    db: { results: sanitizedResults, pagination: results.pagination },
    filters: filterOptions ? filterOptions.filteroptions : [],
    totalEntriesInDatabase: totalEntriesInDatabase
  }, 200);
};

const analyzeColumnType = (values: string[]) => {
  // Skip analysis if too many nullish values
  const validValues = values.filter(v => v && v !== '' && !optionsToOmit.includes(v.toLowerCase()));
  if (validValues.length < 10) return null;

  // Check if dates
  const dateCount = validValues.filter(v => !isNaN(Date.parse(v))).length;
  if (dateCount / validValues.length > 0.8) {
    return { type: 'dateRange' };
  }

  // Check if numbers
  const numberCount = validValues.filter(v => !isNaN(Number(v))).length;
  if (numberCount / validValues.length > 0.8) {
    const numbers = validValues.map(Number);
    return {
      type: 'range',
      min: Math.min(...numbers),
      max: Math.max(...numbers)
    };
  }

  // Check if categorical (few unique values)
  const uniqueValues = new Set(validValues);
  if (uniqueValues.size <= 10 && uniqueValues.size / validValues.length < 0.05) {
    return {
      type: 'select',
      options: Array.from(uniqueValues)
    };
  }

  // Default to text search
  return { type: 'search' };
};

const personalInfoPatterns = [
  // Name patterns
  /^(?:first|last|full|sur)?name$/i,
  /^(?:given|family)[\s_-]?name$/i,

  // Contact patterns
  // /^(?:e?[-_]?mail|email)$/i,
  // /^(?:phone|telephone|mobile|cell)(?:[-_]?(?:num(?:ber)?|no))?$/i,

  // Address patterns
  // /^(?:address|street|city|state|zip|postal|country)$/i,

  // ID patterns
  /^(?:ssn|social|security|tax|id|identifier)(?:[-_]?(?:num(?:ber)?|no))?$/i,

  // Financial patterns
  /^(?:credit|debit|card|account|routing)(?:[-_]?(?:num(?:ber)?|no))?$/i,

  // Birth/Age patterns
  // /^(?:birth|dob|date[-_]?of[-_]?birth|age)$/i,

  // Other sensitive patterns
  /^(?:password|passwd|pass)$/i,
  // /^(?:gender|sex)$/i
];

const containsPersonalInfo = (key: string): boolean => {
  // Normalize the key by removing spaces, underscores and converting to lowercase
  const normalizedKey = key.toLowerCase().replace(/[-_\s]/g, '');

  // Check if the normalized key matches any of our patterns
  return personalInfoPatterns.some(pattern => pattern.test(normalizedKey));
};

const filterPersonalInfo = (data: any[]): any[] => {
  if (!Array.isArray(data)) return data;

  return data.map(item => {
    if (!item.header || !Array.isArray(item.header)) return item;

    item.header = item.header.filter((cell: any) => {
      if (!cell.headername) return true;
      return !containsPersonalInfo(cell.headername);
    });

    return item;
  });
};


module.exports = factories.createCoreController('api::database.database', ({ strapi }) => ({
  async getRows(ctx) {
    // const rateLimitReached = !(await applyRateLimit(ctx));
    // if (rateLimitReached) {
    //   return ctx.send({
    //     message: 'Too Many Requests',
    //     data: []
    //   }, 200);
    // }

    const rows = await strapi.entityService?.findMany('api::database.database', {
      populate: ["header"],
    });


    //do service here

    const sanitizedData = await this.sanitizeOutput(rows, ctx);

    //implement security here

    return ctx.send({
      message: 'success',
      data: sanitizedData
    }, 200);

  },
  async filter(ctx) {
    const user = ctx.state.user;
    if (!user) {
      return ctx.unauthorized('No token provided');
    }

    try {
      return SearchDatabase(ctx);
    } catch (error) {
      return ctx.unauthorized('Invalid token');
    }
  },
  async limited(ctx) {
    ctx.state.tierSettings = {
      maxRecords: 100,
      allowedDataColumns: ['*'],
      allowSearch: true,
      allowExport: false
    };
    ctx.state.user = {
      email: 'free@free.com',
      type: 'demo'
    };
    return SearchDatabase(ctx, true);
  },
  async sync(ctx) {
    if (ctx.request.body.secret !== process.env.STRAPI_ADMIN_SYNC_SECRET) {
      return ctx.send({
        message: 'Invalid secret',
      }, 200);
    }
    // const rateLimitReached = !(await applyRateLimit(ctx));
    // if (rateLimitReached) {
    //   return ctx.send({
    //     message: 'Too Many Requests',
    //   }, 200);
    // }

    await strapi.entityService?.deleteMany('api::database.database', {});

    const data = ctx.request.body.data;
    const batchSize = 100; // adjust the batch size based on your system's capabilities

    const valueCounts = {};

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await processBatch(batch, valueCounts);
    }

    async function processBatch(batch, valueCounts) {
      const promises = batch.map(async (item) => {
        const headers = Object.keys(item).map(key => ({
          headername: key,
          value: item[key]
        }));

        headers.forEach(({ headername, value }) => {
          if (!valueCounts[headername]) {
            valueCounts[headername] = {};
          }
          const values = value.split(',').map((v) => v.trim());
          values.forEach((v) => {
            if (!valueCounts[headername][v]) {
              valueCounts[headername][v] = 0;
            }
            valueCounts[headername][v]++;
          });
        });

        return strapi.entityService.create('api::database.database', {
          data: {
            header: headers
          },
        });
      });

      await Promise.all(promises);

      // Collect all values per column
      const columnValues: Record<string, string[]> = {};

      batch.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
          if (!columnValues[key]) columnValues[key] = [];
          columnValues[key].push(String(value));
        });
      });

      // Generate filter options
      const filterOptions = Object.entries(columnValues).filter(([key, values]) => !containsPersonalInfo(key))
        .map(([key, values]) => {
          const analysis = analyzeColumnType(values);
          if (!analysis) return null;

          return {
            key,
            ...analysis
          };
        })
        .filter(Boolean);

      // Update filter options
      await strapi.db?.query('api::filteroption.filteroption').update({
        where: { title: 'filterings' },
        data: {
          filteroptions: filterOptions
        }
      });
    }

    return ctx.send({
      message: 'success',
    }, 200);
  },
  async export(ctx) {
    // TIER-SETTINGS: this controller is expected to be called after the tier-check middleware
    // TIER-SETTINGS: allowExport

    if (!ctx.state.tierSettings) {
      return ctx.unauthorized('Export not allowed for your subscription tier');
    }
    const tierSettings = ctx.state.tierSettings;

    let enabledExportTypes = ['csv', 'json'];
    const { filteredOptions, searchTerm, sorting, deliveryMethod = 'download', exportType = 'csv' } = ctx.request.body;

    if (!enabledExportTypes.includes(exportType)) {
      return ctx.badRequest('Export type not valid');
    }

    try {
      // Verify auth token
      const user = ctx.state.user;
      if (!user || !user.email) {
        return ctx.unauthorized('Unauthorized access');
      }

      // Build query parameters
      let whereClause = [];
      for (let key in filteredOptions) {
        if (filteredOptions[key]) {
          whereClause.push({
            header: {
              headername: key,
              value: { $containsi: filteredOptions[key].toLowerCase().trim() }
            }
          });
        }
      }

      if (searchTerm) {
        whereClause.push({
          header: {
            value: {
              $containsi: searchTerm
            }
          }
        });
      }
      if (tierSettings.maxRecords && tierSettings.maxRecords > 0) {
        whereClause.push({ id: { $lte: tierSettings.maxRecords } });
      }

      const queryParameters = {
        filters: whereClause.length > 1 ? { $and: whereClause } : whereClause[0],
        sort: sorting,
        populate: {
          header: {
            fields: ['headername', 'value']
          }
        }
      };

      // Count total records that will be exported
      const totalRecords = await strapi.entityService?.count("api::database.database", queryParameters);

      // If more than 1000 records, force email delivery
      const shouldUseEmail = totalRecords > 1000 || deliveryMethod === 'email';
      let allowedHeaders = tierSettings.allowedDataColumns || ['*'];

      if (shouldUseEmail) {
        // Start async export process
        await strapi.service('api::database.database').processExport(
          {
            queryParameters,
            email: user.email,
            totalRecords,
            allowedHeaders,
            user,
            exportType
          }
        );

        return ctx.send({
          success: true,
          message: 'Export started. You will receive an email when it\'s ready.',
          delivery: 'email',
          totalRecords
        });
      }

      // For smaller datasets, generate and return immediately
      const results = await strapi.entityService?.findMany("api::database.database", queryParameters);

      // Transform data and generate CSV
      if (exportType === 'csv') {
        const csvData = await strapi.service('api::database.database').generateCSV(results, false, allowedHeaders);

        ctx.set('Content-Type', 'text/csv');
        ctx.set('Content-Disposition', 'attachment; filename=database_export.csv');

        return ctx.send(csvData);
      } else if (exportType === 'json') {
        const jsonData = await strapi.service('api::database.database').generateJSON(results, allowedHeaders);
        const jsonBlob = Buffer.from(JSON.stringify(jsonData));
        ctx.set('Content-Type', 'application/octet-stream');
        ctx.set('Content-Disposition', 'attachment; filename=database_export.json');
        return ctx.send(jsonBlob);
      }

      return ctx.badRequest('Export type not valid');

    } catch (error) {
      console.error('Export error:', error);
      return ctx.badRequest('Failed to export data');
    }
  },
  async download(ctx) {
    // verify if the request has the authToken

    const token = ctx.query.token;
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.fileId) {
      return ctx.send({
        message: 'Invalid token',
      }, 401);
    }
    const file = await strapi.entityService?.findOne('plugin::upload.file', decoded.fileId);
    if (!file) {
      return ctx.send({
        message: 'File not found',
      }, 404);
    }
    // url is relative to the backend file path
    const filePath = path.join(process.cwd(), '/public', file.url);
    const fileStream = fse.createReadStream(filePath);


    ctx.set('Content-Type', file.mime || 'application/octet-stream');
    ctx.set('Content-Disposition', `attachment; filename="${file.name}"`);

    return ctx.send(fileStream);
  }

}));
