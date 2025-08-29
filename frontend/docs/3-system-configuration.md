# 3. System Configuration

## 3.1. CMS & General Settings

### First-time Setup

1. **Accessing Admin Panel**
   - Navigate to `http://api.your-domain.com/admin` or what you choose when running the `setup.sh`
   - Create your first admin account:
     ```
     Email: admin@example.com
     Password: [Secure Password]
     ```

2. **Initial Configuration**
   - Complete the setup wizard
   - Configure language settings
   - Set up user roles and permissions

> [!NOTE]
> 📸 **Screenshot Needed**: Admin panel first-time setup process

### Strapi Content Manager Overview

1. **Content Types**
   - Users & Permissions
   - Database Collections
   - Products & Subscriptions
   - Email Templates

2. **Media Library**
   - Upload and manage assets
   - Configure storage providers
   - Set up image optimization

3. **API Tokens**
   - Generate admin tokens
   - Configure token permissions
   - Set token expiration

> [!NOTE]
> 📸 **Screenshot Needed**: Content Manager interface with key sections highlighted

### Global Configuration

1. **Single Types Settings**
   ```json
   {
     "template": "default",
     "demoMode": false,
     "maintenanceMode": false,
     "allowRegistration": true
   }
   ```

2. **Feature Toggles**
   - Demo mode configuration
   - Maintenance mode settings
   - Registration controls

> [!NOTE]
> 📸 **Screenshot Needed**: Global configuration interface

## 3.2. Application-Specific Settings

### Template & Display Configuration

1. **Landing Page Customization**
   - Hero section content
   - Feature highlights
   - Testimonials
   - Pricing tables

2. **Theme Settings**
   ```json
   {
     "primaryColor": "#007AFF",
     "secondaryColor": "#5856D6",
     "fontFamily": "Inter, sans-serif",
     "borderRadius": "8px"
   }
   ```

3. **Layout Options**
   - Header configuration
   - Footer content
   - Navigation structure

> [!NOTE]
> 📸 **Screenshot Needed**: Theme customization interface

### Product & Subscription Setup

1. **Stripe Integration**
   - API Key configuration
   - Webhook setup
   ```bash
   # Webhook endpoint
   https://api.your-domain.com/api/webhooks/webhook
   ```

2. **Product Configuration**
   ```json
   {
     "name": "Premium Database Access",
     "description": "Full access to all database categories",
     "price": {
       "amount": 99.99,
       "currency": "USD",
       "interval": "month"
     },
     "features": [
       "Unlimited searches",
       "API access",
       "Priority support"
     ]
   }
   ```

3. **Usage Limits**
   - Search quota configuration
   - Export limitations
   - API rate limiting

> [!NOTE]
> 📸 **Screenshot Needed**: Product and subscription management interface

## 3.3. Email Templates & Notifications

### Predefined Email Templates

1. **Welcome Email**
   ```html
   Subject: Welcome to [Platform Name]!
   
   Hello {{user.firstName}},
   
   Thank you for joining [Platform Name]. Your account has been successfully created.
   
   Access your dashboard here: {{dashboardUrl}}
   
   Best regards,
   The [Platform Name] Team
   ```

2. **Purchase Confirmation**
   ```html
   Subject: Your subscription is active
   
   Hello {{user.firstName}},
   
   Your subscription to {{product.name}} is now active.
   
   Access your data here: {{accessUrl}}
   
   Subscription details:
   - Plan: {{subscription.plan}}
   - Price: {{subscription.price}}
   - Next billing date: {{subscription.nextBillingDate}}
   
   Best regards,
   The [Platform Name] Team
   ```

3. **Password Reset**
   ```html
   Subject: Password Reset Request
   
   Hello {{user.firstName}},
   
   Click the link below to reset your password:
   {{resetUrl}}
   
   If you didn't request this, please ignore this email.
   
   Best regards,
   The [Platform Name] Team
   ```

### Template Customization Guidelines

1. **Required Variables**
   - `{{user}}` - User information
   - `{{product}}` - Product details
   - `{{subscription}}` - Subscription information
   - Various URLs (`{{dashboardUrl}}`, `{{accessUrl}}`, etc.)

2. **HTML Guidelines**
   - Use inline CSS for email compatibility
   - Keep mobile responsiveness in mind
   - Test across different email clients

3. **Best Practices**
   - Include company logo
   - Add social media links
   - Provide contact information
   - Include unsubscribe link

> [!NOTE]
> 📸 **Screenshot Needed**: Email template editor interface

### Notification Settings

1. **Email Provider Configuration**
   ```json
   POSTMARK_API_KEY=
   ```

2. **Notification Triggers**
   - User registration
   - Subscription changes
   - Payment events
   - System alerts

3. **Testing Tools**
   ```bash
   # Test email configuration
   yarn strapi email:test
   ```

> [!NOTE]
> 📸 **Screenshot Needed**: Email provider configuration and testing interface 