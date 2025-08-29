/**
 * database service
 */

import { factories } from '@strapi/strapi';
import { Parser } from 'json2csv';
import { sendMailAttachment, sendEmail } from '../../../postmark';
import utils from "@strapi/utils";
import os from "os";
import * as fse from "fs-extra";
import path from "path";
import { stringify } from 'csv-stringify';
import jwt from 'jsonwebtoken';

type UploadFile = {
  id: string;
  name: string;
  url: string;
  size: number;
  hash: string;
  mime: string
};

export default factories.createCoreService('api::database.database', ({ strapi }) => ({
  // async processExport(params) {

  //   if (exportType === 'csv') {
  //     await this.generateAndEmailCSV(queryParameters, email, totalRecords, allowedHeaders, user);
  //   } else if (exportType === 'json') {
  //     await this.generateAndUploadJSON(totalRecords, allowedHeaders, user);
  //   }
  // },
  async generateCSV(results, isTransformed = false) {
    // Transform data for CSV format
    const transformedData = isTransformed ? results : results.map(record => {
      const row = {};
      record.header.forEach(({ headername, value }) => {
        row[headername] = value;
      });
      return row;
    });

    // Get fields from first row
    const fields = Object.keys(transformedData[0] || {});

    // Create CSV parser
    const json2csvParser = new Parser({ fields });

    // Parse to CSV
    return json2csvParser.parse(transformedData);
  },
  async generateJSON(results, isTransformed = false, allowedHeaders = ['*']) {
    return isTransformed ? results : results.map(record => {
      const row = {};
      record.header.forEach(({ headername, value }) => {
        if (allowedHeaders.includes(headername) || allowedHeaders.includes('*')) {
          row[headername] = value;
        }
      });
      return row;
    });
  },

  async processExport(params) {
    const { queryParameters, email, totalRecords, allowedHeaders, user, exportType } = params;
    const userEmail = user.email;
    try {
      // Process in batches to handle large datasets
      const batchSize = 1000;
      const batches = Math.ceil(totalRecords / batchSize);
      let allData = [];
      for (let i = 0; i < batches; i++) {
        const batchResults = await strapi.entityService?.findMany("api::database.database", {
          ...queryParameters,
          limit: batchSize,
          start: i * batchSize,
        });

        const transformedBatch = batchResults.map(record => {
          const row = {};
          // @ts-ignore
          record.header.forEach(({ headername, value }) => {
            if (allowedHeaders.includes(headername) || allowedHeaders.includes('*')) {
              row[headername] = value;
            }
          });
          return row;
        });

        allData = allData.concat(transformedBatch);
      }

      let uploadedFile;
      if (exportType === 'json') {
        uploadedFile = await this.generateAndUploadJSON(allData, true);
      } else { // default to csv
        uploadedFile = await this.generateAndUploadCSV(allData, true);
      }

      let response;
      const file = uploadedFile[0];
      const tokenData = {
        fileId: file.id,
        userId: user.id,
      }

      const token = jwt.sign(tokenData, strapi.config.get('server.jwtSecret'), { expiresIn: strapi.config.get('server.exportExpiration') });

      const fileLink = `${strapi.config.get('server.url')}/api/database/download?token=${token}`;
      const projectName = strapi.config.get("server.name");

      response = await sendEmail({
        to: userEmail,
        from: strapi.config.get('server.email.fromEmail'),
        replyTo: strapi.config.get('server.email.fromEmail'),
        subject: `${projectName} | Your Database Export is Ready`,
        textbody: `Your requested database export can be found at ${fileLink}. The file contains ${totalRecords} records.`,
        htmlbody: `Your requested database export can be found at <a href="${fileLink}">${file.name}</a>.<br/>The file contains ${totalRecords} records.`,
        messageStream: 'outbound',
      })


    } catch (error) {
      console.error('Error generating and emailing CSV:', error);
      // Send error notification email
      await sendEmail({
        to: userEmail,
        from: strapi.config.get('server.email.fromEmail'),
        replyTo: strapi.config.get('server.email.fromEmail'),
        cc: strapi.config.get('server.email.supportEmail'),
        subject: 'Database Export Failed',
        textbody: 'We encountered an error while generating your database export. Please try again or contact support if the problem persists.',
        htmlbody: 'We encountered an error while generating your database export. Please try again or contact support if the problem persists.',
        messageStream: 'outbound',
      });
    }
  },

  async generateAndUploadJSON(results, isTransformed = false, allowedHeaders = ['*']): Promise<UploadFile[]> {
    try {
      // Step 1: Transform the data (if needed)
      const data = isTransformed ? results : this.generateJSON(results, false, allowedHeaders);

      // Step 2: Create a temporary file
      const tmpWorkingDirectory = await fse.mkdtemp(path.join(os.tmpdir(), "strapi-upload-"));
      const tmpFilePath = path.join(tmpWorkingDirectory, `${Date.now()}.json`);

      // Step 3: Create write stream and write JSON data
      const writeStream = fse.createWriteStream(tmpFilePath);
      writeStream.write('['); // Start JSON array

      // Write data entries with proper comma separation
      data.forEach((row, index) => {
        const json = JSON.stringify(row);
        writeStream.write(index === 0 ? json : `,${json}`);
      });

      writeStream.write(']'); // End JSON array
      writeStream.end();

      // Wait for the file to be written
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });

      const config: any = strapi.config.get("plugin.upload");

      // Step 4: Prepare the file entity for upload
      const fileName = `${Date.now()}.json`;
      const fileEntity = {
        name: fileName,
        hash: utils.nameToSlug(fileName, { separator: "_", lowercase: false }),
        ext: ".json",
        mime: "application/json",
        size: fse.statSync(tmpFilePath).size,
        provider: config.provider,
        tmpWorkingDirectory,
        path: tmpFilePath,
        getStream() {
          return fse.createReadStream(tmpFilePath);
        },
      };

      // Step 5: Upload the file using Strapi's upload plugin
      const uploadService = strapi.plugin("upload").service("upload");
      const uploadedFile: UploadFile[] = await uploadService.upload({
        data: {},
        files: fileEntity,
      });

      // Step 6: Clean up the temporary file
      await fse.remove(tmpWorkingDirectory);

      return uploadedFile;
    } catch (error) {
      console.error('Error generating and uploading JSON:', error);
      throw error;
    }
  },
  async generateAndUploadCSV(results, isTransformed = false, allowedHeaders = ['*']): Promise<UploadFile[]> {
    try {
      // Step 1: Transform the data (if needed)
      const data = isTransformed ? results : results.map(record => {
        const row = {};
        record.header.forEach(({ headername, value }) => {
          if (allowedHeaders.includes(headername) || allowedHeaders.includes('*')) {
            row[headername] = value;
          }
        });
        return row;
      });

      // Step 2: Generate a CSV stream
      const csvStream = stringify({
        header: true, // Include headers in the CSV
      });

      // Step 3: Create a temporary file
      const tmpWorkingDirectory = await fse.mkdtemp(path.join(os.tmpdir(), "strapi-upload-"));
      const tmpFilePath = path.join(tmpWorkingDirectory, `${Date.now()}.csv`);

      // Step 4: Write the CSV data to the temporary file
      const writeStream = fse.createWriteStream(tmpFilePath);
      csvStream.pipe(writeStream);

      // Write data to the CSV stream
      data.forEach((row) => csvStream.write(row));
      csvStream.end();

      // Wait for the file to be written
      await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
      });
      const config: any = strapi.config.get("plugin.upload");
      // Step 5: Prepare the file entity for upload
      const fileName = `${Date.now()}.csv`;
      const fileEntity = {
        name: fileName,
        hash: utils.nameToSlug(fileName, { separator: "_", lowercase: false }),
        ext: ".csv",
        mime: "text/csv",
        size: fse.statSync(tmpFilePath).size, // Get the file size
        provider: config.provider,
        tmpWorkingDirectory, // Set the temporary directory
        path: tmpFilePath, // Explicitly set the path property
        getStream() {
          return fse.createReadStream(tmpFilePath); // Return a read stream for the file
        },
      };

      // Step 6: Upload the file using Strapi's upload plugin
      const uploadService = strapi.plugin("upload").service("upload");
      const uploadedFile: UploadFile[] = await uploadService.upload({
        data: {}, // Additional metadata (optional)
        files: fileEntity,
      });

      console.log(uploadedFile);

      // Step 7: Clean up the temporary file
      await fse.remove(tmpWorkingDirectory);

      return uploadedFile;
    } catch (error) {
      console.error('Error generating and uploading CSV:', error);
      throw error;
    }
  },

}));
