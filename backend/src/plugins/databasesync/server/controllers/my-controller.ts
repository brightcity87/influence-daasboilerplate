import { Strapi } from '@strapi/strapi';
import { Readable } from 'stream';
import { parse } from 'csv-parse';
import fs from 'fs';
import path from 'path';
import os from 'os';

interface HeaderComponent {
  headername: string;
  value: string;
}

interface DatabaseEntry {
  header: HeaderComponent[];
}

interface CsvRecord {
  [key: string]: string;
}

interface UploadJob {
  id: string;
  status: 'processing' | 'completed' | 'failed';
  progress: number;
  totalRows: number;
  processedRows: number;
  error?: string;
}

interface FilteringOption {
  key: string;
  type: 'search' | 'select';
}

interface FieldStats {
  uniqueValues: Set<string>;
  totalSamples: number;
  totalLength: number;
  hasSpecialChars: boolean;
  allShortValues: boolean;
  allHaveCommonPattern: boolean;
  sampleCount: number;
}

interface FieldCount {
  value: string;
  count: number;
}

const activeJobs = new Map<string, UploadJob>();
const jobSubscribers = new Map<string, Set<(data: any) => void>>();

// Create a temporary directory for our files
const TMP_DIR = path.join(os.tmpdir(), 'databasesync-uploads');
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR, { recursive: true });
}

export default ({ strapi }: { strapi: Strapi }) => ({
  async getFields(ctx) {
    try {
      // Get the first entry with populated header components
      const entries = await strapi.entityService?.findMany('api::database.database', {
        limit: 1,
        populate: {
          header: {
            fields: ['headername', 'value']
          }
        }
      });

      console.log('Fetched entries:', entries);

      let fields: string[] = [];
      if (entries && entries[0]?.header) {
        fields = entries[0].header.map((h: HeaderComponent) => h.headername);
      }

      console.log('Extracted fields:', fields);
      ctx.body = { fields };
    } catch (error) {
      console.error('Error in getFields:', error);
      ctx.throw(500, error);
    }
  },

  async upload(ctx) {
    try {
      const { files } = ctx.request.files || {};
      if (!files) {
        console.error('No files in request:', ctx.request.files);
        return ctx.throw(400, 'No file uploaded');
      }

      const { data } = ctx.request.body;
      if (!data) {
        return ctx.throw(400, 'No data provided');
      }

      let parsedData;
      try {
        parsedData = JSON.parse(data);
      } catch (e) {
        console.error('Error parsing data:', e);
        return ctx.throw(400, 'Invalid data format');
      }

      const { fieldMapping, overwrite } = parsedData;
      const uploadedFile = Array.isArray(files) ? files[0] : files;

      if (!uploadedFile?.path) {
        console.error('No file path in:', uploadedFile);
        return ctx.throw(400, 'Invalid file upload');
      }

      // Generate a unique job ID and file path
      const jobId = Date.now().toString();
      const newFilePath = path.join(TMP_DIR, `upload_${jobId}.csv`);

      // Copy the file to our managed directory
      try {
        fs.copyFileSync(uploadedFile.path, newFilePath);
        console.log(`File copied to ${newFilePath}`);
      } catch (e) {
        console.error('Error copying file:', e);
        return ctx.throw(500, 'Failed to process upload');
      }

      // Initialize job status
      const job: UploadJob = {
        id: jobId,
        status: 'processing',
        progress: 0,
        totalRows: 0,
        processedRows: 0
      };
      activeJobs.set(jobId, job);

      // Start processing in the background
      this.processFileInBackground(newFilePath, fieldMapping, overwrite, jobId).catch(error => {
        console.error('Background processing error:', error);
        job.status = 'failed';
        job.error = error.message;
        activeJobs.set(jobId, job);
        // Clean up the file on error
        try {
          if (fs.existsSync(newFilePath)) {
            fs.unlinkSync(newFilePath);
          }
        } catch (e) {
          console.error('Error cleaning up file after failure:', e);
        }
      });

      // Return immediately with the job ID
      ctx.body = { jobId };
    } catch (error) {
      console.error('Error in upload:', error);
      ctx.throw(500, error);
    }
  },
  async getActiveJobs(ctx) {
    const allJobs = Array.from(activeJobs.values());
    ctx.body = { jobs: allJobs };
  },

  async getJobStatus(ctx) {
    const { id } = ctx.params;
    const job = activeJobs.get(id);

    if (!job) {
      return ctx.throw(404, 'Job not found');
    }

    ctx.body = job;
  },

  async subscribeToJob(ctx) {
    const { id } = ctx.params;
    const job = activeJobs.get(id);
    console.log('Subscribing to job:', id);
    console.log('Job:', job);
    console.log('Active jobs:', activeJobs);

    if (!job) {
      return ctx.throw(404, 'Job not found');
    }

    try {
      // Set headers for SSE
      ctx.set({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
      });

      // Disable Koa response handling
      ctx.respond = false;
      ctx.res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      });

      // Function to send SSE updates
      const sendUpdate = (data: any) => {
        try {
          ctx.res.write(`data: ${JSON.stringify(data)}\n\n`);
        } catch (error) {
          console.error('Error sending SSE update:', error);
        }
      };

      // Add subscriber
      if (!jobSubscribers.has(id)) {
        jobSubscribers.set(id, new Set());
      }
      jobSubscribers.get(id)!.add(sendUpdate);

      // Send initial state
      sendUpdate(job);

      // Keep the connection alive
      const keepAlive = setInterval(() => {
        try {
          ctx.res.write(': ping\n\n');
        } catch (error) {
          console.error('Error sending keepalive:', error);
          clearInterval(keepAlive);
        }
      }, 30000);

      // Handle connection close
      ctx.req.on('close', () => {
        console.log('SSE connection closed for job:', id);
        clearInterval(keepAlive);
        const subscribers = jobSubscribers.get(id);
        if (subscribers) {
          subscribers.delete(sendUpdate);
          if (subscribers.size === 0) {
            jobSubscribers.delete(id);
          }
        }
      });

      // Handle connection errors
      ctx.req.on('error', (error) => {
        console.error('SSE connection error:', error);
        clearInterval(keepAlive);
      });
    } catch (error) {
      console.error('Error setting up SSE:', error);
      ctx.throw(500, 'Failed to setup event stream');
    }
  },

  async processFileInBackground(filePath: string, fieldMapping: Record<string, string>, overwrite: boolean, jobId: string) {
    const job = activeJobs.get(jobId)!;
    let fileDeleted = false;
    let uniqueValues: Record<string, Set<string>> = {};

    const notifySubscribers = (jobData: UploadJob) => {
      const subscribers = jobSubscribers.get(jobId);
      if (subscribers) {
        subscribers.forEach(subscriber => subscriber(jobData));
      }
    };

    const cleanupFile = () => {
      if (!fileDeleted && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
          fileDeleted = true;
          console.log(`Cleaned up file: ${filePath}`);
        } catch (e) {
          console.error('Error cleaning up file:', e);
        }
      }
    };

    try {
      // Verify the file exists before starting
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
      }

      // First pass: count total rows and collect sample statistics
      const countStream = fs.createReadStream(filePath);
      const countParser = parse({
        columns: true,
        skip_empty_lines: true
      });

      let totalRows = 0;
      const fieldStats: Record<string, FieldStats> = {};
      const SAMPLE_RATE = 0.1; // Sample 10% of the data
      const MAX_SAMPLES = 1000; // Cap samples at 1000 per field

      for await (const record of countStream.pipe(countParser)) {
        totalRows++;

        // Determine if we should sample this record
        const shouldSample = Math.random() < SAMPLE_RATE;

        if (shouldSample) {
          Object.entries(record).forEach(([header, value]) => {
            const targetField = overwrite ? header : fieldMapping[header];
            if (!targetField) return;

            if (!fieldStats[targetField]) {
              fieldStats[targetField] = initializeFieldStats();
            }

            // Only update stats if we haven't reached max samples
            if (fieldStats[targetField].sampleCount < MAX_SAMPLES) {
              updateFieldStats(fieldStats[targetField], value as string);
            }
          });
        }
      }

      // Update job with total rows
      job.totalRows = totalRows;
      job.progress = 0;
      activeJobs.set(jobId, job);
      notifySubscribers(job);

      console.log(`Total rows to process: ${totalRows}`);

      if (overwrite) {
        await strapi.db?.query('api::database.database').deleteMany({
          where: {}
        });
        await strapi.db?.query('api::filteroption.filteroption').deleteMany({
          where: {}
        });
      }

      // Create filtering options array with dynamic type detection
      const filteringOptions: FilteringOption[] = Object.entries(fieldStats).map(([field, stats]) => {
        const fieldLower = field.toLowerCase();

        // Always force search for obvious search fields
        if (fieldLower.includes('name') ||
          fieldLower.includes('email') ||
          fieldLower.includes('description') ||
          fieldLower.includes('url') ||
          fieldLower.includes('text') ||
          fieldLower.includes('note')) {
          return {
            key: field,
            type: 'search'
          };
        }

        // Calculate select score based on sampled statistics
        const selectScore = calculateSelectScoreFromStats(stats, totalRows);
        console.log(`Field: ${field}, Select Score: ${selectScore}, Unique Values: ${stats.uniqueValues.size}, Samples: ${stats.sampleCount}`);

        // Adjust thresholds based on sampling
        const effectiveTotalRows = Math.min(totalRows, MAX_SAMPLES / SAMPLE_RATE);
        if (selectScore > 0.6 && stats.uniqueValues.size <= Math.max(20, effectiveTotalRows * 0.1)) {
          return {
            key: field,
            type: 'select'
          };
        }

        return {
          key: field,
          type: 'search'
        };
      });

      // Sort filtering options by key for consistency
      filteringOptions.sort((a, b) => a.key.localeCompare(b.key));

      // Create or update the single filtering options document
      const existingFilterings = await strapi.db?.query('api::filteroption.filteroption').findMany({
        where: { title: 'filterings' }
      });

      if (existingFilterings && existingFilterings.length > 0) {
        await strapi.db?.query('api::filteroption.filteroption').update({
          where: { title: 'filterings' },
          data: {
            filteroptions: filteringOptions
          }
        });
      } else {
        await strapi.entityService?.create('api::filteroption.filteroption', {
          data: {
            title: 'filterings',
            filteroptions: filteringOptions
          }
        });
      }

      console.log('Created filtering options:', filteringOptions);

      // Second pass: process the data
      const fileStream = fs.createReadStream(filePath);

      // Handle file read errors
      fileStream.on('error', (error) => {
        console.error('Error reading file:', error);
        job.status = 'failed';
        job.error = 'Error reading file: ' + error.message;
        activeJobs.set(jobId, job);
        notifySubscribers(job);
        cleanupFile();
      });

      const parser = parse({
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relaxColumnCount: true
      });

      // Handle parser errors
      parser.on('error', (error) => {
        console.error('Error parsing CSV:', error);
        job.status = 'failed';
        job.error = 'Error parsing CSV: ' + error.message;
        activeJobs.set(jobId, job);
        notifySubscribers(job);
        cleanupFile();
      });

      // Pipe the file stream through the parser
      fileStream.pipe(parser);

      const batchSize = 100;
      let batch: DatabaseEntry[] = [];
      let processedRows = 0;

      // Process records as they come in
      for await (const record of parser) {
        const headerComponents: HeaderComponent[] = [];

        if (overwrite) {
          Object.entries(record).forEach(([header, value]) => {
            if (value) {
              headerComponents.push({
                headername: header,
                value: value as string
              });
            }
          });
        } else {
          Object.entries(fieldMapping).forEach(([csvField, dbField]) => {
            if (dbField === null) return; // Skip ignored fields
            const value = (record as CsvRecord)[csvField];
            if (value) {
              headerComponents.push({
                headername: dbField,
                value: value,
              });
            }
          });
        }

        if (headerComponents.length > 0) {
          batch.push({ header: headerComponents });
        }

        if (batch.length >= batchSize) {
          try {
            for (let i = 0; i < batch.length; i++) {
              const entry = batch[i];
              await strapi.entityService?.create('api::database.database', {
                data: {
                  header: entry.header
                },
              });
              processedRows += 1;
            }
            batch = [];
            if ((processedRows * 100 / totalRows) > (job.progress + 10)) {
              console.log(`Progress: ${job.progress}% (${processedRows}/${totalRows})`);
            }

            if (processedRows % 100 === 0 || (processedRows * 100 / totalRows) > (job.progress + 1)) {
              job.processedRows = processedRows;
              job.progress = Math.floor((processedRows * 100) / totalRows);
              activeJobs.set(jobId, job);
              notifySubscribers(job);
            }
          } catch (dbError) {
            console.error('Database error during batch insert:', dbError);
            job.status = 'failed';
            job.error = 'Database error: ' + dbError.message;
            activeJobs.set(jobId, job);
            notifySubscribers(job);
            cleanupFile();
            return;
          }
        }
      }

      if (batch.length > 0) {
        try {
          for (let i = 0; i < batch.length; i++) {
            const entry = batch[i];
            await strapi.entityService?.create('api::database.database', {
              data: {
                header: entry.header
              },
            });
            processedRows += 1;
          }
        } catch (dbError) {
          console.error('Database error during final batch insert:', dbError);
          job.status = 'failed';
          job.error = 'Database error: ' + dbError.message;
          activeJobs.set(jobId, job);
          notifySubscribers(job);
          cleanupFile();
          return;
        }
      }

      // Generate popular searches based on overall occurrences
      await generatePopularSearches(strapi);

      // Update final status
      job.status = 'completed';
      job.processedRows = processedRows;
      job.progress = 100;
      activeJobs.set(jobId, job);
      notifySubscribers(job);

      // Clean up the temporary file
      cleanupFile();
      activeJobs.delete(jobId);
    } catch (error) {
      console.error('Error processing file:', error);
      job.status = 'failed';
      job.error = error.message;
      activeJobs.set(jobId, job);
      notifySubscribers(job);

      // Clean up on error
      cleanupFile();
      activeJobs.delete(jobId);
    }
  },

  async getAllRows(ctx) {
    try {
      const entries = await strapi.entityService?.findMany('api::database.database', {
        populate: {
          header: {
            fields: ['headername', 'value']
          }
        }
      });
      ctx.body = { data: entries };
    } catch (error) {
      ctx.throw(500, error);
    }
  }
});

// Add these helper functions after the interfaces
function initializeFieldStats(): FieldStats {
  return {
    uniqueValues: new Set(),
    totalSamples: 0,
    totalLength: 0,
    hasSpecialChars: false,
    allShortValues: true,
    allHaveCommonPattern: true,
    sampleCount: 0
  };
}

function updateFieldStats(stats: FieldStats, value: string): void {
  if (!value) return;

  stats.sampleCount++;
  stats.totalLength += value.length;
  stats.uniqueValues.add(value);

  // Check for special characters
  if (!stats.hasSpecialChars && /[^a-zA-Z0-9\s-_]/.test(value)) {
    stats.hasSpecialChars = true;
  }

  // Check value length
  if (stats.allShortValues && value.length > 20) {
    stats.allShortValues = false;
  }

  // Check pattern
  if (stats.allHaveCommonPattern &&
    !/^[A-Z0-9-_]+$/.test(value) &&
    !/^[a-zA-Z]+$/.test(value)) {
    stats.allHaveCommonPattern = false;
  }
}

function calculateSelectScoreFromStats(stats: FieldStats, totalRows: number): number {
  const uniqueRatio = stats.uniqueValues.size / stats.totalSamples;
  const avgLength = stats.totalLength / stats.sampleCount;

  let score = 0;

  // Unique ratio weight (0-0.4)
  score += (1 - Math.min(uniqueRatio * 10, 1)) * 0.4;

  // Length weight (0-0.2)
  score += (1 - Math.min(avgLength / 20, 1)) * 0.2;

  // Pattern weight (0-0.4)
  if (stats.allShortValues) score += 0.1;
  if (!stats.hasSpecialChars) score += 0.1;
  if (stats.allHaveCommonPattern) score += 0.2;

  return score;
}

async function generatePopularSearches(strapi: Strapi) {
  const knex = strapi.db?.connection;

  if (!knex) {
    console.error('Database connection not available');
    return;
  }

  try {
    // Using a raw query to get top occurrences across all fields
    const query = `
      SELECT
        ch.value,
        ch.headername,
        COUNT(*) as occurrences
      FROM databases d
      JOIN databases_components dc ON d.id = dc.entity_id
      JOIN components_header_headers ch ON dc.component_id = ch.id
      WHERE ch.value IS NOT NULL
      GROUP BY ch.value, ch.headername
      ORDER BY occurrences DESC
      LIMIT 5;
    `;

    const results = await knex.raw(query);

    // Delete existing popular searches
    // await strapi.db?.query('api::popular-search.popular-search').deleteMany({
    //   where: {}
    // });

    // Create new popular searches
    let order = 0;
    for (const row of results.rows) {
      await strapi.entityService?.create('api::popular-search.popular-search', {
        data: {
          searchTerm: `${row.value}`,
          order: order++,
          isActive: true,
          publishedAt: new Date()
        }
      });
    }

    console.log('Created popular searches:', results.rows);
  } catch (error) {
    console.error('Error updating popular searches:', error);
    console.error('Error details:', error.message);
    if (error.query) {
      console.error('Failed query:', error.query);
    }
  }
}
