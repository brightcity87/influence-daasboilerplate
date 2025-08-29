import * as fse from 'fs-extra';
import path from 'path';

export default {
  '0 0 * * *': async ({ strapi }) => {
    strapi.log.info('---running cron job :: delete old export files---');
    strapi.log.info('---deleting files older than 1 days---');
    // delete all files older than 1 day
    const filesMetadata = await strapi.entityService?.findMany('plugin::upload.file', {
      where: {
        createdAt: {
          $gte: new Date(Date.now() - 48 * 60 * 60 * 1000)
        }
      }
    });
    // delete the files that timestamp is older than 24 hours

    const matchingFiles = filesMetadata.filter(file => {
      const timestamp = file.hash.split('_')[0];
      // hash format is `timestamp_hash.ext`?
      // we need to check if the file name is in the format `timestamp_hash.ext`
      // if not, we need to delete the file
      if (!file.hash.match(/^\d+_\w+\.\w+$/)) {
        return false;
      }
      return new Date(timestamp) < new Date(Date.now() - 24 * 60 * 60 * 1000);
    });

    // delete the files
    matchingFiles.forEach(file => {
      strapi.log.info(`---deleting file ${file.url} ${file.name}`);
      fse.unlinkSync(path.join(process.cwd(), 'public', file.url));
    });

  }
}