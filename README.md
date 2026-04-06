# ShopSwift - E-Commerce with Fast Checkout

React + Vite frontend, Node.js/Express backend, Stripe payments, MySQL.

## Setup

### 1. Database
```bash
mysql -u root -p < backend/config/schema.sql
```

### 2. Backend
```bash
cd backend
cp .env.example .env   # fill in your values
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env   # add your Stripe publishable key
npm install
npm run dev
```

## Stripe Setup
1. Create a free account at https://stripe.com
2. Copy your test keys from the Stripe dashboard
3. For webhooks locally, use the Stripe CLI:
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```

## Features
- Product catalog with search & category filter
- Cart with quantity management
- Fast checkout with Stripe Payment Element (supports cards, Apple Pay, Google Pay)
- Order history with status tracking
- JWT auth (register/login)
- Admin product management (set role='admin' in DB)
# ecommerce-website
