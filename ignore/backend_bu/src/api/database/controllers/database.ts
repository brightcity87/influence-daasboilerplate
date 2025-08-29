/**
 * row controller
 */

import { factories } from '@strapi/strapi'
import { RateLimiterMemory } from 'rate-limiter-flexible';
import jwt from 'jsonwebtoken';

const rateLimiter = new RateLimiterMemory({
  points: 20, // Number of points
  duration: 60, // Per minute (60 seconds)
});

const dailyLimitedRateLimiter = new RateLimiterMemory({
  points: 3, // Number of points
  duration: 24 * 60 * 60, // Per day (in seconds)
});

const keysToOmit = ['FirstName', 'First_Name', 'LastName', 'Last_Name', 'FullName', 'Full_Name', 'Name', 'Surname'].map((key) => key.toLowerCase());
const optionsToOmit = ["", '-', 'N/A', 'n/a', 'NA', 'na', 'None', 'none', 'null', 'Null', 'NULL', 'nil', 'Nil', 'NIL', 'undefined', 'Undefined', 'UNDEFINED', 'unknown', 'Unknown', 'UNKNOWN', 'TBD', 'tbd', 'To be determined', 'to be determined', 'TobeDetermined', 'tobedetermined', 'TobeDetermined', 'tobedetermined']
const applyRateLimit = async (ctx, limiter = rateLimiter) => {
  // Use X-Forwarded-For header if available, otherwise fall back to the direct IP
  const clientIp = ctx.request.headers['x-forwarded-for'] || ctx.request.ip;
  console.log('Client IP:', clientIp); // Log the IP for debugging
  try {
    await limiter.consume(clientIp);
    return true;
  } catch (rejRes) {
    console.log('Rate limit reached for IP:', clientIp); // Log when rate limit is reached
    return false;
  }
};

const SearchDatabase = async (ctx:any, limited = false) => {
  let rateLimitReached = false;
  if (limited) {
    rateLimitReached = !(await applyRateLimit(ctx, dailyLimitedRateLimiter));
  } else {
    rateLimitReached = !(await applyRateLimit(ctx));
  }

  if (rateLimitReached) {
    return ctx.send({
      message: limited ? 'Done' : 'Too Many Requests',
      db: { results: [], pagination: { page: 1, pageSize: 0, pageCount: 0, total: 0 } },
      filters: [],
      totalEntriesInDatabase: 0
    }, 200);
  }

  const data = ctx.request.body;
  const searchTerm = data.searchTerm ? data.searchTerm.toLowerCase().trim() : '';

  let whereClause = [];

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

  const queryParameters = {
    page: data.page || 1,
    pageSize: limited ? 3 : (data.pageSize || 10),
    filters: whereClause.length > 0 ? { $and: whereClause } : {},
    populate: ['header']
  };

  const results = await strapi.entityService?.findPage("api::database.database", {
    ...queryParameters,
    populate: {
      header: {
        fields: ['headername', 'value']
      }
    }
  });

  const sanitizedResults = results?.results.map(({ header }) => ({
    header: header.map(({ headername, value }) => ({ headername, value }))
  }));

  const filterOptions = await strapi.db?.query('api::filteroption.filteroption').findOne({
    where: { title: 'filterings' },
  });

  const totalEntriesInDatabase = await strapi.entityService?.count('api::database.database');

  console.log(sanitizedResults);
  return ctx.send({
    message: 'success',
    db: { results: sanitizedResults, pagination: results.pagination },
    filters: filterOptions ? filterOptions.filteroptions : [],
    totalEntriesInDatabase: totalEntriesInDatabase
  }, 200);
}

module.exports = factories.createCoreController('api::database.database', ({ strapi }) => ({
    async getRows(ctx) {
        const rateLimitReached = !(await applyRateLimit(ctx));
        if (rateLimitReached) {
            return ctx.send({
                message: 'Too Many Requests',
                data: []
            }, 200);
        }

        const rows = await strapi.entityService?.findMany('api::database.database',{
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
      return SearchDatabase(ctx);

    },
    async limited(ctx){
        return SearchDatabase(ctx, true);
    },
    async sync(ctx) {
        if (ctx.request.body.secret !== process.env.STRAPI_ADMIN_SYNC_SECRET) {
            return ctx.send({
                message: 'Invalid secret',
            }, 200);
        }
        const rateLimitReached = !(await applyRateLimit(ctx));
        if (rateLimitReached) {
            return ctx.send({
                message: 'Too Many Requests',
            }, 200);
        }

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
        }

        // Filter out values that appear less than 2 times
        const filteredValueCounts = {};
        Object.keys(valueCounts).forEach((headername) => {
            filteredValueCounts[headername] = Object.keys(valueCounts[headername]).filter((value) => valueCounts[headername][value] >= 2);
        });

        // Update the filterOptions array with the filtered value counts
        const filterOptions = Object.keys(filteredValueCounts).map((headername) => ({
            key: headername,
            type: 'string',
            options: filteredValueCounts[headername].map((value) => ({ value })).filter((option) => !optionsToOmit.includes(option.value.toLowerCase())),
        })).filter((option) => !keysToOmit.includes(option.key.toLowerCase())).filter((option) => option.options.length > 0);

        await strapi.db?.query('api::filteroption.filteroption').update({
            where: { title: 'filterings' },
            data: {
                filteroptions: filterOptions
            }
        });

        return ctx.send({
            message: 'success',
        }, 200);
    }

}));
