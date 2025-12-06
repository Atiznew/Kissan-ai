
# KrishiAI-Central Backend API

Precision Farming REST API built with Node.js, TypeScript, and PostgreSQL.

## Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local dev without Docker)

## Quick Start (Local)

1. **Bootstrap Infrastructure**
   ```bash
   docker-compose up -d --build
   ```
   This starts PostgreSQL and the Node.js API. The database is auto-seeded with the schema in `database/init.sql`.

2. **Access API**
   - Health Check: `http://localhost:3000/health`
   - Swagger Documentation: `http://localhost:3000/api-docs`

3. **Sample Workflow**
   - **Signup**: POST `/api/v1/auth/signup` with `{ "phone_number": "9876543210", "password": "pass", "full_name": "Ramesh", "role": "farmer" }`
   - **Verify OTP**: POST `/api/v1/auth/verify-otp` with `{ "phone_number": "9876543210", "otp": "123456" }` -> Returns `token`.
   - **Login**: POST `/api/v1/auth/login` -> Returns `token`.
   - **Add Field**: POST `/api/v1/fields` (Header: `Authorization: Bearer <token>`).

## Deployment to Google Cloud (Cloud Run)

1. **Build Container**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/krishiai-api
   ```

2. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy krishiai-api \
     --image gcr.io/PROJECT_ID/krishiai-api \
     --platform managed \
     --allow-unauthenticated \
     --set-env-vars DB_HOST=YOUR_DB_IP,DB_PASSWORD=YOUR_PASS,JWT_SECRET=PROD_SECRET
   ```

## Testing
Run unit tests with Jest:
```bash
npm test
```
