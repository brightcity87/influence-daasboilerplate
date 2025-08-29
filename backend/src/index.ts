import fs from 'fs'
import path from 'path'
import documentationData from './api/documentation/content/documentation-import.json';
import seedData from './database/seed/seed-data';

const { blogs, faqs, products, testimonials, popularSearches, config, emailTemplates } = seedData;

async function hasMigrationRun(strapi, name: string): Promise<boolean> {
  const knex = strapi.db.connection;
  const migration = await knex('strapi_migrations')
    .where('name', name)
    .first();
  return !!migration;
}

async function recordMigration(strapi, name: string) {
  const knex = strapi.db.connection;
  await knex('strapi_migrations').insert({
    name,
    time: new Date()
  });
}

type ApiPermissionTuple = [string, string, string[]];

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) { },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    try {
      if (strapi.config.get('server.seed') === 'false') {
        strapi.log.info("Seed is disabled");
        return;
      }
      // Initial permissions setup
      const migrationName = 'initial-permissions-setup-001';
      if (!await hasMigrationRun(strapi, migrationName)) {
        const service = await strapi.service('plugin::users-permissions.role');
        const roles = await service.find();
        const { id } = roles.find(r => r.type === 'public');
        const publicRole = await service.findOne(id);

        // Reset permissions
        Object.keys(publicRole.permissions).forEach(t => {
          Object.keys(publicRole.permissions[t].controllers).forEach(c => {
            Object.keys(publicRole.permissions[t].controllers[c]).forEach(a => {
              publicRole.permissions[t].controllers[c][a].enabled = false;
              publicRole.permissions[t].controllers[c][a].policy = '';
            });
          });
        });

        // Set new permissions

        const permissions: ApiPermissionTuple[] = [
          ['api::config', 'config', ['find']],
          ['api::blog', 'blog', ['find', 'findOne']],
          ['api::database', 'database', ['getRows', 'sync', 'filter', 'limited']],
          ['api::faq', 'faq', ['find']],
          ['api::filteroption', 'filteroption', ['find']],
          ['api::product', 'product', ['find']],
          ['api::testimonial', 'testimonial', ['find']],
          ['api::webhook', 'webhook', ['contactus', 'find', 'webhook', 'create', 'setGithub', 'sendLoginLink', 'verifyToken']],
          ['api::documentation', 'documentation', ['find', 'findOne']],
          ['api::popular-search', 'popular-search', ['find', 'findOne']],
        ];

        permissions.forEach(([type, controller, actions]) => {
          actions.forEach(action => {
            if (publicRole.permissions[type]?.controllers[controller]?.[action]) {
              publicRole.permissions[type].controllers[controller][action].enabled = true;
            }
          });
        });

        await service.updateRole(publicRole.id, publicRole);
        await recordMigration(strapi, migrationName);
      }

      // Seed initial data
      const seedMigrationName = 'initial-data-seed-001';
      if (!await hasMigrationRun(strapi, seedMigrationName)) {
        // Use transaction to ensure data consistency
        await strapi.db.transaction(async () => {


          // Seed documentation
          for (const doc of documentationData.data) {
            try {
              await strapi.entityService.create('api::documentation.documentation', {
                data: {
                  ...doc,
                  publishedAt: new Date().toISOString()
                }
              });
            } catch (error) {
              console.error(`Failed to create documentation: ${doc.title}`, error);
            }
          }

          // Seed other content types
          const dataToSeed = [
            { model: 'api::config.config', data: config },
            { model: 'api::blog.blog', data: blogs },
            { model: 'api::faq.faq', data: faqs },
            { model: 'api::product.product', data: products },
            { model: 'api::testimonial.testimonial', data: testimonials },
            { model: 'api::popular-search.popular-search', data: popularSearches },
            { model: 'api::email-template.email-template', data: emailTemplates },
          ];

          for (const { model, data } of dataToSeed) {
            for (const item of data) {
              try {
                await strapi.entityService.create(model, { data: item });
              } catch (error) {
                console.error(`Failed to create ${model}:`, error);
                console.log(error.details.errors)
              }
            }
          }
          // Seed filteroption schema
          try {
            await strapi.entityService.create('api::filteroption.filteroption', {
              data: {
                title: 'filterings',
                filteroptions: {}
              }
            });
          } catch (error) {
            console.error('Failed to create filteroption schema:', error);
            console.log(error.details?.errors);
          }
        });

        await recordMigration(strapi, seedMigrationName);
      }

      // Seed custom tables
      const customViewMigrationName = 'custom-views-seed-001';
      if (!await hasMigrationRun(strapi, customViewMigrationName)) {
        strapi.log.info("Custom views seeding started");
        try {
          console.log("Starting data seeding process...");
          let seedDir = path.join(__dirname, "database", "seed", "schemas");
          let seedFiles = fs.readdirSync(seedDir);

          for (const file of seedFiles) {
            console.log(`Processing seed file: ${file}`);
            const tableName = path.parse(file).name;
            const seedData = require(path.join(seedDir, file));
            await strapi.db.transaction(async () => {
              for (const item of seedData) {
                await upsertRecord(strapi, { tableName, record: item, uniqueIdentifier: "key" });
              }
            })
            console.log(`Completed processing ${file}`);
          }
          console.log("Data seeding completed successfully");
          strapi.log.info("Custom views seeding completed");

          await recordMigration(strapi, customViewMigrationName);
        } catch (error) {
          console.error("Error during table data seeding:", error);
        }

      }

    } catch (error) {
      console.error('Bootstrap error:', error);
      throw error;
    }
  }
}
async function upsertRecord(strapi, { tableName, record, uniqueIdentifier }) {
  const { [uniqueIdentifier]: id, ...data } = record;

  // Access the Strapi database connection
  const knex = strapi.db.connection;

  // Check if the record exists
  const existingRecord = await knex(tableName).where(uniqueIdentifier, id).first();

  if (existingRecord) {
    // Update the existing record
    await knex(tableName).where(uniqueIdentifier, id).update(data);
    strapi.log.info(`Record with ${uniqueIdentifier} = ${id} updated in table ${tableName}.`);
  } else {
    // Insert a new record
    await knex(tableName).insert(record);
    strapi.log.info(`New record inserted with ${uniqueIdentifier} = ${id} in table ${tableName}.`);
  }
}
