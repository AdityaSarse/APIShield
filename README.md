# APIShield


> **Full-Stack API Gateway, Security & Monitoring Platform**


APIShield is a full-stack API Gateway and monitoring platform designed to sit between clients and backend services. It provides API-key authentication, Redis-based rate limiting, request logging, gateway proxying, real-time monitoring, analytics, and an administrative dashboard.


## 🚀 Features


- 🔐 JWT Authentication & Role-Based Authorization
- 🔑 API-Key Authentication & Management
- 🌐 API Gateway & Reverse Proxy
- 🚦 Redis-Based Rate Limiting
- 📝 Request Logging
- 📊 Real-Time Dashboard
- 📈 Advanced API Analytics
- ⚡ Response-Time Monitoring
- 📉 P50 / P95 / P99 Latency Analytics
- 🔎 Endpoint & Service Performance Analytics
- 🔥 Error & Status-Code Analytics
- 👥 API-Key Usage Analytics
- 📡 Live Gateway Monitoring
- 🕐 Recent Request Monitoring
- 🐳 Docker & Docker Compose Support
- 🗄️ PostgreSQL + Prisma
- ⚡ Redis for high-speed rate-limit state


## 🏗️ Architecture


```text
Client
  │
  ▼
┌─────────────────────────────┐
│       APIShield Gateway     │
│                             │
│  API-Key Authentication     │
│           ↓                 │
│  Redis Rate Limiter         │
│           ↓                 │
│  Request Logger             │
│           ↓                 │
│  Gateway Proxy              │
└──────────────┬──────────────┘
               │
               ▼
        Target API Service
               │
        ┌──────┴──────┐
        ▼             ▼
   PostgreSQL       Redis
        │             │
        └──────┬──────┘
               ▼
      Dashboard / Analytics
🔄 Request Lifecycle
Client Request
      ↓
API-Key Authentication
      ↓
Redis Rate Limiting
      ↓
Request Logging
      ↓
Gateway Proxy
      ↓
Target Service
      ↓
Response
      ↓
PostgreSQL / Redis
      ↓
Analytics & Dashboard
🛠️ Tech Stack
Layer	Technology
Frontend	React + Vite
Styling	Tailwind CSS
Data Fetching	TanStack Query
Backend	Node.js + Express.js
ORM	Prisma
Database	PostgreSQL
Cache / Rate Limiting	Redis
Authentication	JWT
Infrastructure	Docker + Docker Compose
Reverse Proxy	Nginx
📊 Analytics

APIShield provides:

Total Requests
Success Rate
Error Rate
Status-Code Distribution
Service Traffic
Top API Keys
Daily Request Analytics
Gateway Monitoring
Rate-Limit Analytics
Recent Requests
Response-Time Analytics
Endpoint Performance
Service Performance
API-Key Performance
Response-Time Metrics
Average
Minimum
P50
P95
P99
Maximum
🔌 Analytics API
GET /api/v1/analytics/summary
GET /api/v1/analytics/status-codes
GET /api/v1/analytics/services
GET /api/v1/analytics/top-api-keys
GET /api/v1/analytics/response-times
GET /api/v1/analytics/daily
GET /api/v1/analytics/error-rate
GET /api/v1/analytics/monitoring
GET /api/v1/analytics/rate-limits
GET /api/v1/analytics/recent-requests
📁 Project Structure
APIShield/
├── Backend/
│   ├── middleware/
│   │   ├── apiKey.middleware.js
│   │   ├── auth.middleware.js
│   │   ├── authorize.middleware.js
│   │   ├── rateLimiter.middleware.js
│   │   └── requestLogger.middleware.js
│   │
│   └── modules/
│       ├── analytics/
│       ├── apikey/
│       ├── auth/
│       ├── gateway/
│       └── workspace/
│
├── Frontend/
│   └── src/
│       ├── api/
│       └── features/
│           ├── dashboard/
│           └── analytics/
│
├── docker-compose.yml
├── Dockerfiles
├── nginx configuration
└── README.md
⚙️ Getting Started
Prerequisites
Node.js
npm
PostgreSQL
Redis
Docker & Docker Compose
Clone
git clone <repository-url>
cd APIShield
Backend
cd Backend
npm install
npm run dev

Configure the required environment variables before starting.

Frontend
cd Frontend
npm install
npm run dev

The frontend uses Vite for development.

Docker
docker compose up --build
🔐 Environment Variables

Create your environment configuration using the project's required variables.

Example:

DATABASE_URL=
REDIS_URL=
JWT_SECRET=
PORT=5000
CORS_ORIGIN=

Never commit real secrets to GitHub.

🧪 Testing

APIShield should be tested across the complete lifecycle:

Authentication
      ↓
API Key
      ↓
Gateway
      ↓
Rate Limiting
      ↓
Request Logging
      ↓
Target Service
      ↓
Analytics
      ↓
Dashboard

Important scenarios include:

Valid and invalid authentication
Valid and invalid API keys
Successful gateway requests
Failed requests
Rate-limit violations
429 Too Many Requests
Request logging
Analytics consistency
Dashboard updates
Live monitoring
P95/P99 calculations
Docker deployment
🔒 Security

APIShield follows several security practices:

JWT-protected routes
Role-based authorization
API-key authentication
Redis-based rate limiting
Safe API-key prefix display
Environment-based secrets
Prisma ORM for database access
Controlled error responses
No exposure of sensitive credentials
🐳 Infrastructure

The application can be containerized using:

PostgreSQL
Redis
APIShield Backend
Frontend
Nginx

Docker provides a consistent development and deployment environment.

🚧 Future Improvements

Potential future enhancements include:

Advanced date-range filtering
Analytics export
API performance alerts
Error-rate alerts
Latency alerts
Historical rate-limit analytics
Endpoint latency trends
Automated E2E testing
Production deployment automation
📌 Project Status

APIShield currently includes:

✅ API Gateway
✅ Authentication
✅ Authorization
✅ API Keys
✅ Redis Rate Limiting
✅ Request Logging
✅ PostgreSQL + Prisma
✅ Analytics Backend
✅ Dashboard
✅ Analytics Page
✅ Live Monitoring
✅ P95 / P99 Analytics
✅ Advanced Analytics
✅ UI/UX Polish
🔨 Final Testing & Production Validation
🎯 Project Goal

APIShield provides a centralized platform to:

Secure APIs → Control Traffic → Monitor Services → Analyze Performance

APIShield — Secure APIs. Control Traffic. Understand Performance.