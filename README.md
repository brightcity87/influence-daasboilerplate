# DaaS Boilerplate

<div align="center">

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker-compose.yml)
[![Documentation](https://img.shields.io/badge/Documentation-Complete-green.svg)](frontend/docs/index.md)

A comprehensive boilerplate for building Database-as-a-Service (DaaS) applications with Next.js, Strapi, and Docker.

[Documentation](frontend/docs/index.md) • [Quick Start](#quick-start) • [Features](#features) • [Support](#support)

</div>

## Overview

DaaS Boilerplate is a production-ready boilerplate for creating database access services. It provides a complete solution for monetizing your database through a modern web application with subscription-based access control.

### Key Features

- 🔐 **Secure Database Access**: Role-based access control and usage monitoring
- 💳 **Built-in Payment Integration**: Stripe integration for subscription management
- 🚀 **Modern Tech Stack**: Next.js, Strapi CMS, and Docker
- 🔍 **Advanced Search**: Powerful search capabilities with rate limiting
- 📱 **Responsive Design**: Mobile-first approach with modern UI/UX
- 🔄 **Data Sync**: Efficient database synchronization tools
- 📄 **Export Options**: Multiple export formats (CSV, JSON)

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js (v18+)
- Yarn package manager
- OpenSSL for certificate generation

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/iamfra5er/daasboilerplate.git
   cd daasboilerplate
   ```

2. **Run Setup Script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

3. **Start the Application**
   ```bash
   # Development mode
   docker-compose -f docker-compose.local.yml up -d

   # Production mode
   docker-compose up -d
   ```

4. **Access the Application**
   - Frontend: `http://localhost:3000`
   - Admin Panel: `http://localhost:1337/admin`

For detailed setup instructions, see our [Installation Guide](docs/2-installation-and-setup.md).

## Architecture

```
daas-boilerplate/
├── frontend/           # Next.js frontend application
├── backend/           # Strapi CMS backend
├── docker/           # Docker configuration files

```

## Development

### Local Development

```bash
# Frontend development
cd frontend
yarn install
yarn dev

# Backend development
cd backend
yarn install
yarn develop
```

### Testing

```bash
# Run all tests
yarn test

# Run specific tests
yarn test:frontend
yarn test:backend
```



## Acknowledgments

- Next.js Team
- Strapi Team

---
