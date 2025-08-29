# 2. Installation & Setup

## 2.1. Prerequisites

### System Requirements

Before installing DaaS Boilerplate, ensure your system meets the following requirements:

1. **Operating System**
   - Unix-based system (Linux or macOS) recommended
   - Windows with WSL2 supported
   
2. **Required Software**
   - Docker Engine (20.10.x or higher)
   - Docker Compose (2.x or higher)
   - Node.js (18.x or higher)
   - Yarn (1.22.x or higher)
   - OpenSSL (for SSL certificate generation)

> [!NOTE]
> 📸 **Screenshot Needed**: System requirements verification commands and expected output

### Environment Files

The system uses several environment files for configuration:

1. **Root Directory**
   - `.env`: Main environment configuration
   - `.env.example`: Template for main configuration

2. **Frontend Directory**
   - `frontend/.env`: Frontend-specific configuration
   - `frontend/.env.example`: Template for frontend configuration

3. **Backend Directory**
   - `backend/.env`: Backend-specific configuration
   - `backend/.env.example`: Template for backend configuration

> [!NOTE]
> 📸 **Screenshot Needed**: Directory structure showing environment files

## 2.2. Installation Process

### Repository Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/daas-boilerplate.git
   cd daas-boilerplate
   ```

2. **Run Setup Script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

   The setup script performs the following actions:
   - Copies environment file templates
   - Installs dependencies
   - Generates SSL certificates
   - Initializes Docker volumes

> [!NOTE]
> 📸 **Screenshot Needed**: Setup script execution and successful completion

### Deployment Options

#### Docker Deployment (Recommended)

1. **Production Mode**
   ```bash
   docker-compose up -d
   ```

2. **Development Mode**
   ```bash
   docker-compose -f docker-compose.local.yml up -d
   ```

#### Direct Node.js Execution

1. **Frontend Development**
   ```bash
   cd frontend
   yarn install
   yarn dev
   ```

2. **Backend Development**
   ```bash
   cd backend
   yarn install
   yarn develop
   ```

> [!NOTE]
> 📸 **Screenshot Needed**: Both Docker and Node.js deployment methods in action

## 2.3. Environment Configuration

### Traefik Proxy Setup

1. **Domain Configuration**
   - Edit `docker/traefik/traefik.yml`
   - Configure your domain in `.env`
   ```env
   DOMAIN=your-domain.com
   ```

2. **SSL Certificates**
   - Automatic Let's Encrypt configuration
   - Manual certificate placement in `docker/traefik/certs/`

> [!NOTE]
> 📊 **Diagram Needed**: Traefik proxy routing flow

### Environment Variables

Key environment variables to configure:

1. **General Configuration**
   ```env
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=postgresql://user:password@localhost:5432/dbname
   ```

2. **Security Settings**
   ```env
   JWT_SECRET=your-secure-jwt-secret
   ADMIN_JWT_SECRET=your-secure-admin-jwt-secret
   API_TOKEN_SALT=your-api-token-salt
   ```

3. **External Services**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

> [!NOTE]
> 📸 **Screenshot Needed**: Environment configuration interface or example

### Post-Installation Verification

1. **Health Checks**
   ```bash
   curl http://localhost/health
   curl http://localhost/api/health
   ```

2. **Service Status**
   ```bash
   docker-compose ps
   ```

3. **Logs Verification**
   ```bash
   docker-compose logs -f
   ```

> [!NOTE]
> 📸 **Screenshot Needed**: Successful health check and service status output 