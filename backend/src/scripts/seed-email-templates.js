const fs = require("fs");
const path = require("path");

async function seedEmailTemplates() {
  try {
    const templatesData = JSON.parse(
      fs.readFileSync(path.join(__dirname, "../api/email-template/content/seeds/email-templates.json"), "utf8")
    );

    for (const template of templatesData.templates) {
      const existing = await strapi.query("api::email-template.email-template").findOne({
        where: { name: template.name },
      });

      if (!existing) {
        await strapi.entityService.create("api::email-template.email-template", {
          data: {
            ...template,
            publishedAt: new Date(),
          },
        });
        console.log(`Created template: ${template.name}`);
      } else {
        console.log(`Template already exists: ${template.name}`);
      }
    }

    console.log("Email templates seeded successfully");
  } catch (error) {
    console.error("Error seeding email templates:", error);
  }
}

seedEmailTemplates();
