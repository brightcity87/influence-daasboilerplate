# Migration Guide 

This document provides a comprehensive guide for users migrating from previous versions to the latest release. It highlights key changes, provides step-by-step instructions, and offers guidance for a smooth transition. Please read this guide carefully before upgrading to ensure a seamless experience.

## Important Considerations Before Migrating

*   **Backup Your Data:** Before initiating the migration, create a complete backup of your existing database and codebase. This precaution allows you to revert to the previous version if any issues arise during the migration process.
*   **Environment Variables:** Verify that all necessary environment variables are correctly configured before starting the migration. Consult the `.env.example` file for a comprehensive list of required variables and their expected values.
*   **Database Seeding:** **If your database contains existing data, DO NOT execute the seed commands.** Running these commands will overwrite your existing data with default values, leading to data loss. Seed commands should only be used when starting with a fresh, empty database. (add to backend/.env `SEED=false`)
*   **Testing:** It is highly recommended to perform the migration in a staging or development environment before applying it to your production environment. This allows you to identify and resolve any potential issues without impacting your live application.
*   **Setup Script:** A `setup.sh` script is provided to automate many of the migration steps. **Use this script with caution,** as it may override your local configurations. Review the script carefully before execution to understand its actions.

## Strapi Changes and Migration Steps

### Core Updates

*   **Strapi CMS:** The Strapi CMS backend has been upgraded to the latest version, incorporating performance enhancements and security patches.
    *   **Migration:** Review the official Strapi documentation for detailed information on the changes in this version and any necessary migration steps.
*   **Dependencies:** Several dependencies have been updated to their latest versions, including key packages like `@strapi/provider-upload-local` and `@strapi/utils`.
    *   **Migration:** Update your `package.json` file to reflect these changes and run `yarn install` to install the updated dependencies.

### Environment Configuration

*   **.dockerignore:** The `.dockerignore` file has been refined to exclude unnecessary files and directories from Docker builds, optimizing image size and build times.
    *   **Migration:** Update your `.dockerignore` file to match the latest version.
*   **.gitignore:** The `.gitignore` file has been updated to include new files and directories related to Strapi, preventing them from being committed to your repository.
    *   **Migration:** Update your `.gitignore` file to match the latest version.
*   **.prettierrc:** The `.prettierrc` file has been updated with new formatting rules to ensure consistent code style throughout the project.
    *   **Migration:** Replace your existing `.prettierrc` file with the latest version.
*   **Environment Variables:** Several environment variables have been modified or added to improve configuration and flexibility.
    *   **Changes:**
        *   `DOMAINNAME` has been split into `DOMAINNAME`, `FRONTEND_DOMAINNAME`, and `BACKEND_DOMAINNAME`.
        *   New variables `BACKEND_PORT`, `FRONTEND_PORT`, `NEXT_PUBLIC_FRONTEND_PORT`, and `NEXT_PUBLIC_BACKEND_PORT` have been added.
    *   **Migration:**
        1.  Update your `.env` file to reflect these changes.
        2.  Ensure that `FRONTEND_DOMAINNAME` and `BACKEND_DOMAINNAME` are set correctly to your frontend and backend domains, respectively.
        3.  Set `BACKEND_PORT` and `FRONTEND_PORT` to the desired port numbers for your backend and frontend applications.
        4.  Set `NEXT_PUBLIC_FRONTEND_PORT` and `NEXT_PUBLIC_BACKEND_PORT` to the same values as `FRONTEND_PORT` and `BACKEND_PORT`, respectively.

### Server Configuration

*   **config/cront-tasks.ts:** A new cron job has been added to automatically delete old export files, optimizing storage space and improving performance.
    *   **Migration:** Copy the new cron task configuration to your `config/cront-tasks.ts` file.
*   **middlewares.ts:** The CORS configuration has been updated to include specific methods, headers, and expose options, enhancing security and compatibility. Additionally, the `daas-auth` middleware has been added for token verification and user authentication.
    *   **Migration:**
        1.  Update your `middlewares.ts` file to reflect these changes.
        2.  Ensure that the CORS configuration is properly configured for your environment, allowing only necessary origins and methods.
        3.  Add the `daas-auth` middleware to your global middleware configuration to enable token-based authentication.
*   **backend/config/plugins.ts:** The `verboseLogs` configuration has been removed, and a new configuration for the `upload` plugin has been added to use local storage with a size limit of 250 MB.
    *   **Migration:**
        2.  Add the new configuration for the `upload` plugin to enable local file uploads with the specified size limit.
*   **server.ts:** The `server.ts` file has been updated with various configurations for the application, including settings for name, domain, URLs, JWT secret, export settings, Stripe, Google, email, cron, and proxy.
    *   **Migration:** Update your `server.ts` file to include these configurations, ensuring that you set the correct values for your environment.

### Database Schema and Content Types

*   **backend/src/api/config/content-types/config/schema.json:** New fields have been added to the `config` content type, including `siteLogo`, `allowDemo`, and `onlyDemo`, allowing you to customize the application's appearance and behavior.
    *   **Migration:** Update your `backend/src/api/config/content-types/config/schema.json` file to include these fields.
*   **Email Templates:** A new collection type `email_templates` has been added with attributes for managing email templates, including name, subject, description, htmlBody, textBody, and variables.
    *   **Migration:** Create the `email_templates` collection type in your Strapi CMS with the specified attributes.
*   **Popular Search Content Type:** The popular search content type has been updated with new attributes, including `searchTerm`, `order`, and `isActive`, and a new display name.
    *   **Migration:** Update your popular search content type to reflect these changes.
*   **Product Schema:** The `displayName` for the product has been changed from "product" to "Product", and new fields have been added to the product schema, including `rank`, `priceId`, `oldPriceId`, `mode`, `subscriptionSettings`, `users`, and `isDemo`.
*   **Stripe Errors Schema:** A new collection type `stripe_errors` has been added with attributes for storing information about Stripe errors, including `eventId`, `eventType`, `error`, `timestamp`, `retryCount`, and `lastError`.
*   **Stripe Events Schema:** A new collection type `stripe_events` has been added with attributes for storing and processing Stripe events, including `eventId`, `type`, `processed`, `processingErrors`, `retryCount`, `lastProcessedAt`, and `lockExpiresAt`.
*   **User Schema:** New fields have been added to the user schema for tracking subscription information, including `subscriptionTier`, `subscriptionStatus`, `subscriptionStartDate`, `subscriptionEndDate`, `allowance`, and `downloadMetadata`.

### API and Controller Logic

*   **api/config/controllers/config.ts:** The `tierConfig` function has been added to retrieve tier settings for a user based on their subscription tier and user allowances.
*   **backend/src/api/config/routes/config.ts:** The default export in `config.ts` has been updated to include a custom router function that allows predefined routes and custom routes to be added. A new custom route has been added for `GET /me/tier-config` with specific handler and configuration settings.
*   **database.ts Controller:** The `database.ts` controller has been updated with new features such as tier settings, max record limits, and filtering options.
*   **Popular Search Controller:** The popular-search controller has been renamed to `popular-search.ts` and moved to the `backend/src/api/popular-search/controllers` directory.
*   **Product Controller:** The product controller has been renamed to documentation controller, and the import statement for factories has been updated to '@strapi/strapi'.
*   **Webhook Controller:** The `webhook.ts` file has been updated with new constants, utility functions, and logic for handling webhook events.

### Services and Policies

*   **backend/src/api/database/middlewares/tier-check.ts:** A new middleware `tier-check.ts` has been added to set tier settings based on user type and subscription tier and to check and enforce limits for search, export, and copy operations.
*   **backend/src/api/database/policies/has-feature-access.ts:** The `hasFeatureAccess` policy has been added to control access to specific features based on user roles and permissions.
    *   **Migration:** Copy the `has-feature-access.ts` file to your `backend/src/api/database/policies` directory.
*   **database.ts:** New policies and middlewares have been added for authentication and access control, `requiredFeatures` for specific endpoints, and `userTypeToRateLimiter` for rate limiting based on user type.
    *   **Migration:** Update your `database.ts` file to include these changes.
*   **Popular Search Service:** The popular search service has been updated to use the `factories` module from `@strapi/strapi`.
    *   **Migration:** Add your popular search documents.
*   **Product Service:** The `updateSubscription` method has been commented out, and the `createCoreService` method now includes a callback function that handles subscription updates.
    *   **Migration:** Review the changes made to the `product.ts` file and update your code accordingly.
*   **Webhook Stripe Policy:** The `stripe.ts` policy file has been updated with improved webhook verification logic.


### Data Handling and Export

*   **database.ts:** New modules and functions have been added for handling data exports, including `json2csv`, `postmark`, `@strapi/utils`, `os`, `fse`, `path`, `jsonwebtoken`, `generateCSV`, `generateJSON`, `processExport`, `generateAndUploadJSON`, and `generateAndUploadCSV`.

### Frontend Components and Hooks

*   **New Components:** Several new components have been added for documentation and shared functionality, including `CodeBlock`, `DocContent`, `DocHeading`, `DocLayout`, `DocSidebar`, `FeatureList`, `KeyTakeaway`, `ProTip`, and `TextSection`.
*   **Updated Components:** Existing components have been updated with new props, styling, and functionality, including `AuthAlert`, `CTA`, `CardComponent`, `ColumnManager`, `NavBarHeader`, `PaginationComponent`, `VirtualizedTable`, `Wrapper`, `DatabaseSidebar`, `DatabaseToolbar`, `ExportButton`, and `TierWarning`.
*   **New Hooks:** New hooks have been added to provide reusable functionality, including `useCopyBlocker`, `useDebounce`, `useTableState`, and `useTierSettings`.
*   **Updated Hooks:** The `useUserAuthentication.tsx` hook has been updated with improved token verification logic.

### API Endpoints

*   **api/docs/\[slug].ts:** A new API endpoint has been added for fetching documentation based on slug.
*   **api/search/free.ts:** The existing API endpoint `/api/search/free` has been updated to use the new code provided in the diff.

### Next.js Configuration

*   **next.config.js:** The `port` value is now set to `process.env.NEXT_PUBLIC_FRONTEND_PORT` instead of the hardcoded value `1337`. A new remote pattern has been added for images with `protocol: "https"` and `hostname: "i.imgur.com"`. The `domains` array has been changed to use double quotes instead of single quotes.

### Docker Configuration

*   **docker-compose.local.yml:** The traefik service configuration has been removed, and a mailpit service configuration has been added.
*   **docker-compose.yml:** The `postgres` image version has been updated, health checks have been added, ports have been updated, and volume names have been updated.
*   **Dockerfile:** The Dockerfile has been updated with various changes, including the installation of the nodemailer package, updated permissions for the uploads directory, and the use of multi-stage builds.

### Other Updates

*   **manifest.json:** The `short_name` and `name` fields have been updated to "DaaS". An icon has been added. The `start_url` has been set to ".". The `display` has been changed to "standalone". The `theme_color` has been set to "#000000". The `background_color` has been set to "#ffffff".
*   **seed-email-templates.js:** A new script `seed-email-templates.js` has been added to seed email templates data.
    *   **Migration:** **If you have existing data in your database, DO NOT run the seed command.**

## New Features

*   **Email Templates:** The application now supports email templates, allowing you to customize the emails that are sent to your users.
*   **Tier-Based Settings:** The application now supports tier-based settings, allowing you to configure different settings for different user tiers.
*   **Documentation Collection Type:** The application now includes a documentation collection type, allowing you to manage your documentation content within the CMS.
*   **Database Sync Plugin:** The application now includes a database sync plugin, allowing you to synchronize your database with external sources.
*   **New Components:** The application now includes a variety of new components for documentation and shared functionality, enhancing the user interface and providing reusable building blocks.
*   **useCopyBlocker Hook:** The application now includes the `useCopyBlocker` hook, which prevents users from copying content from the application, protecting sensitive data.
*   **Mailpit Integration:** The application now includes Mailpit for local email testing, simplifying the development and testing of email functionality.
*   **Stripe Integration:** The application now includes Stripe integration for payments, enabling seamless payment processing within the application.
*   **daas-auth Middleware:** The application now includes the `daas-auth` middleware for token verification and user authentication, enhancing security and access control.
*   **Webhook Rate Limiting:** The application now includes webhook rate limiting for enhanced security, preventing abuse and ensuring the stability of the application.

## How to Safely Migrate

1.  **Backup your data:** Before starting the migration process, it is crucial to back up your existing database and codebase. This will allow you to revert to the previous version if any issues arise during the migration.
2.  **Update your environment variables:** Ensure that all required environment variables are properly configured before starting the migration. Refer to the `.env.example` file for a list of required variables.
3.  **Update your dependencies:** Update your `package.json` file to include the new dependencies and update the existing dependencies to the latest versions. Run `yarn install` to install the new dependencies.
4.  **Update your code:** Update your code to reflect the changes in the Strapi CMS, the new components, the new hooks, and the new API endpoints.
5.  **Test your application:** After completing the migration process, thoroughly test your application to ensure that everything is working as expected.

By following these steps, you can safely migrate to the latest version of the application and take advantage of the new features and improvements.