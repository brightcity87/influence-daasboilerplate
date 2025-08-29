# 9. Changelog & Roadmap

## 9.1. Version History

### Version 2.0.0 (Development)

1.  **Unreleased Changes (Pull Request)**
Released: 2025-02-11

#### Features & Improvements:
- **Core Updates:**
   - Upgraded Strapi CMS to the latest version.
   - Updated dependencies, including `@strapi/provider-upload-local` and `@strapi/utils`.
- **Environment Configuration:**
   - Refined `.dockerignore` and updated `.gitignore` and `.prettierrc` files.
   - Modified and added environment variables (DOMAINNAME, FRONTEND_DOMAINNAME, BACKEND_DOMAINNAME, BACKEND_PORT, FRONTEND_PORT, NEXT_PUBLIC_FRONTEND_PORT, NEXT_PUBLIC_BACKEND_PORT).
- **Server Configuration:**
   - Added cron job to delete old export files (`config/cront-tasks.ts`).
   - Updated CORS configuration and added `daas-auth` middleware (`middlewares.ts`).
   - Added upload plugin configuration with a size limit of 250 MB (`backend/config/plugins.ts`).
   - Updated `server.ts` with configurations for application settings, domains, URLs, JWT secret, Stripe, Google, email, cron, and proxy.
- **Database Schema and Content Types:**
   - Added `siteLogo`, `allowDemo`, and `onlyDemo` fields to the `config` content type.
   - Added `email_templates` collection type.
   - Updated popular search content type.
   - Updated product schema with new fields.
   - Added `stripe_errors` and `stripe_events` collection types.
   - Added subscription information fields to the user schema.
- **API and Controller Logic:**
   - Added `tierConfig` function to `api/config/controllers/config.ts`.
   - Updated `backend/src/api/config/routes/config.ts` with a custom router function and a new route for `GET /me/tier-config`.
   - Updated `database.ts` controller with tier settings, max record limits, and filtering options.
   - Updated and moved popular search and product controllers.
   - Updated `webhook.ts` with new constants, utility functions, and logic for handling webhook events.
- **Services and Policies:**
   - Added `tier-check.ts` middleware.
   - Added `hasFeatureAccess` policy.
   - Updated `database.ts` with new policies and middlewares.
   - Updated popular search and product services.
   - Updated `stripe.ts` webhook policy.
- **Data Handling and Export:**
   - Added modules and functions for data exports in `database.ts`.
- **API Endpoints:**
   - Added `api/docs/[slug].ts` endpoint.
   - Updated `api/search/free.ts` endpoint.
- **Next.js Configuration:**
   - Updated `next.config.js` with new port setting and image remote pattern.
- **Docker Configuration:**
   - Updated `docker-compose.local.yml` and `docker-compose.yml`.
   - Updated `Dockerfile`.
- **Other Updates:**
   - Updated `manifest.json`.
   - Added `seed-email-templates.js` script.
- **New Features:**
   - Email Templates
   - Tier-Based Settings
   - Documentation Collection Type
   - Database Sync Plugin
   - New Components
   - `useCopyBlocker` Hook
   - Mailpit Integration
   - Stripe Integration
   - `daas-auth` Middleware
   - Webhook Rate Limiting

####  **Migration Guide**
Important Considerations Before Migrating:
 - Backup Your Data
 - Environment Variables: Consult the `.env.example` file for new formamt.
 - Database Seeding: **DO NOT** execute seed commands if you have existing data
   - set `SEED=false` on `backend/.env` and `./.env`
 - Check `setup.sh` , it will add any needed variables

Ref. @migration.md


### Version 1.0.0 (Latest)

1. **Initial Release**
   ```markdown
   Released: 2024-02-01

   Features:
   - Complete database access management system
   - Stripe integration for payments
   - User authentication and authorization
   - Search and export functionality
   - Docker-based deployment

   Breaking Changes:
   - N/A (Initial Release)
   ```

2. **Known Issues**
   ```markdown
   - Large dataset imports (>100MB) may timeout
   - Search performance degrades with complex queries
   - Some UI elements need RTL support
   ```

> [!NOTE]
> 📸 **Screenshot Needed**: Version history and release notes interface

### Version 0.9.0 (Beta)

1. **Features & Improvements**
```markdown
Released: 2024-01-15

Added:
- Beta testing of core features
- Initial documentation
- Basic deployment scripts

Fixed:
- Database connection stability
- Authentication edge cases
- Docker compose configurations
```

2. **Migration Guide**
```bash
# Backup existing data
./scripts/backup.sh

# Update dependencies
yarn install

# Run migrations
yarn migrate:up
```

## 9.2. Upcoming Features

### Short-term Goals

1. **Performance Improvements**
- Implement Redis caching
- Optimize database queries
- Add connection pooling
- Improve search response time

2. **Feature Enhancements**
- Multi-language support
- Advanced search filters
- Bulk data operations
- Enhanced export options

> [!NOTE]
> 📊 **Diagram Needed**: Feature roadmap timeline

### Mid-term Goals (Q2-Q3 2024)

1. **Platform Extensions**
- API rate limiting system
- Custom plugin architecture
- Enhanced analytics dashboard
- Automated backup system

2. **Integration Expansions**
- Additional payment providers
- OAuth provider integration
- External API connectors
- Enhanced webhook system

### Long-term Vision

1. **Major Features**
- Machine learning integration
- Real-time data synchronization
- Advanced visualization tools
- Custom reporting engine

2. **Infrastructure**
- Multi-region deployment
- Enhanced security features
- Automated scaling
- Disaster recovery system

## 9.4. Release Process

### Release Checklist

1. **Pre-release**
```markdown
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Change log prepared
- [ ] Performance benchmarks
- [ ] Security audit
```

3. **Post-release**
```markdown
- [ ] Deploy to production
- [ ] Monitor metrics
- [ ] Update status page
- [ ] Notify users
```

> [!NOTE]
> 📊 **Diagram Needed**: Release process workflow 