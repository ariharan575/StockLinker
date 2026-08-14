# StockLinker Frontend

<p align="center">
  <strong>StockLinker</strong><br/>
  <em>Intelligent B2B Wholesale Commerce Experience</em>
</p>

<p align="center">
  Modern Retail • Wholesale Intelligence • Supplier Discovery • Procurement
</p>

<p align="center">

![React](https://img.shields.io/badge/React-18%2B-000000?style=for-the-badge\&logo=react\&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-000000?style=for-the-badge\&logo=javascript\&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-000000?style=for-the-badge\&logo=vite\&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-000000?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-000000?style=for-the-badge\&logo=framer\&logoColor=white)

</p>

---

# Overview

The **StockLinker Frontend** is the customer-facing web application for StockLinker, a B2B wholesale commerce and supply-network platform connecting shopkeepers with wholesalers.

The frontend is designed around a premium SaaS experience while solving practical wholesale procurement problems.

The application brings together:

* Product discovery
* Category browsing
* Supplier discovery
* Price comparison
* Inventory visibility
* Wholesale ordering
* Order status
* Delivery workflows
* Supplier communication
* Authentication
* Role selection
* Business dashboards
* Responsive mobile workflows

The frontend communicates with the StockLinker Spring Boot backend through REST APIs and real-time messaging infrastructure.

---

# The Problem

Wholesale procurement is often fragmented.

A shopkeeper may need to:

```text
Search Product
      ↓
Call Supplier
      ↓
Ask Price
      ↓
Ask Availability
      ↓
Compare Another Supplier
      ↓
Check Minimum Quantity
      ↓
Place Order
      ↓
Follow Up
      ↓
Track Delivery
```

StockLinker brings these workflows into a single digital experience.

Instead of multiple disconnected tools:

```text
Search + Compare + Discover + Order + Communicate + Track
                         │
                         ▼
                    StockLinker
```

---

# Who Uses the Frontend?

## Shopkeepers

The shopkeeper experience focuses on:

* Finding products
* Discovering wholesale suppliers
* Comparing available purchasing options
* Reviewing pricing
* Checking minimum quantities
* Ordering products
* Monitoring orders
* Tracking delivery
* Communicating with suppliers

## Wholesalers

The wholesaler experience focuses on:

* Managing products
* Managing inventory
* Presenting products to buyers
* Receiving wholesale orders
* Managing order workflows
* Communicating with shopkeepers
* Managing supplier-side business operations

---

# Product Vision

StockLinker is designed as a digital procurement layer between retail businesses and wholesale suppliers.

The frontend therefore focuses on three principles:

### Discover

Help users quickly find products and suppliers.

### Decide

Give users useful information for purchasing decisions.

### Execute

Move the user from discovery to order and communication with minimal friction.

---

# Core Experience

```text
                    STOCKLINKER
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    DISCOVER           DECIDE          EXECUTE
        │                │                │
    Products          Compare          Orders
    Categories        Prices           Delivery
    Suppliers         Stock            Chat
    Search            Quantity         Tracking
```

---

# Technology Stack

## Core

* React.js
* JavaScript
* Vite
* React Router
* Axios

## UI

* Tailwind CSS
* Framer Motion
* Lucide React
* React Icons

## Authentication

* Firebase Authentication
* Firebase Phone OTP
* Google OAuth2
* JWT through HttpOnly cookies

## State

The frontend primarily uses:

* React Hooks
* Context API
* Local component state
* Server/API state through Axios

The authentication architecture avoids storing JWT tokens in browser-readable storage.

---

# Important Architecture Rule

The browser must never directly manage sensitive JWT tokens.

The frontend does **not** intentionally store:

```text
accessToken → localStorage
refreshToken → localStorage
accessToken → sessionStorage
refreshToken → sessionStorage
JWT → React Context
```

Authentication is handled through HttpOnly cookies managed by the backend.

---

# Application Architecture

```text
┌───────────────────────────────────────────────┐
│                 StockLinker UI                │
├───────────────────────────────────────────────┤
│ Pages / Screens                               │
├───────────────────────────────────────────────┤
│ Reusable Components                           │
├───────────────────────────────────────────────┤
│ Context / Hooks                               │
├───────────────────────────────────────────────┤
│ API Services                                  │
├───────────────────────────────────────────────┤
│ Axios Instance                                │
├───────────────────────────────────────────────┤
│ REST API / WebSocket                          │
└───────────────────────────────────────────────┘
                         │
                         ▼
              StockLinker Backend
```

---

# Authentication Experience

StockLinker supports three primary authentication methods.

## Google OAuth

The user selects:

```text
Continue with Google
```

The browser redirects to:

```text
/oauth2/authorization/google
```

Spring Security handles the OAuth flow.

After successful authentication, the backend establishes the secure session using HttpOnly cookies.

The frontend then loads the authenticated user through:

```http
GET /api/auth/me
```

---

# Phone OTP

The phone authentication flow uses Firebase.

```text
Phone Number
     ↓
Firebase OTP
     ↓
Firebase ID Token
     ↓
POST /api/auth/phone/login
     ↓
Spring Boot
     ↓
HttpOnly Authentication Cookies
     ↓
Authenticated Frontend
```

The frontend never receives the server JWT as a browser-readable token.

---

# Guest Login

The frontend supports:

```http
POST /api/auth/guest/login
```

This allows users to enter the application without the standard account creation flow.

---

# Role Selection

After authentication, a user without a selected business role is routed to:

```text
/role-selection
```

The available roles are:

```text
SHOPKEEPER
WHOLESALER
```

The frontend sends the selected role through:

```http
POST /api/auth/role/select
```

After successful role selection, the user proceeds to the appropriate application experience.

---

# Authentication API Surface

| Purpose            | Method | Endpoint                       |
| ------------------ | -----: | ------------------------------ |
| Phone OTP Login    |   POST | `/api/auth/phone/login`        |
| Guest Login        |   POST | `/api/auth/guest/login`        |
| Role Selection     |   POST | `/api/auth/role/select`        |
| Current User       |    GET | `/api/auth/me`                 |
| Session Check      |    GET | `/api/auth/session`            |
| Refresh Session    |   POST | `/api/auth/refresh`            |
| Logout             |   POST | `/api/auth/logout`             |
| Logout All Devices |   POST | `/api/auth/logout-all`         |
| Google OAuth Start |    GET | `/oauth2/authorization/google` |

---

# Axios Architecture

The application uses a centralized Axios instance.

Conceptually:

```javascript
axios.create({
  baseURL: `${VITE_API_URL}/api`,
  withCredentials: true
});
```

This allows the frontend to communicate with the backend while automatically including authentication cookies.

---

# Automatic Token Refresh

When an authenticated API request receives a `401` response, the Axios layer can initiate:

```http
POST /api/auth/refresh
```

The browser automatically supplies the refresh cookie.

The architecture also uses a refresh queue to avoid multiple simultaneous refresh requests.

Conceptually:

```text
Request A ──┐
Request B ──┼── 401
Request C ──┘
             │
             ▼
       One Refresh Request
             │
             ▼
       New Authentication
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
       A     B     C
```

This prevents race conditions during session renewal.

---

# Product Discovery

Product discovery is one of the most important frontend experiences.

The UI is designed to make product search feel closer to a modern marketplace while preserving B2B information density.

The experience can include:

* Product search
* Categories
* Subcategories
* Supplier availability
* Product information
* Pricing
* Minimum order quantity
* Stock availability
* Supplier comparison

---

# Product Categories

The frontend consumes:

```http
GET /api/v1/categories
```

The category interface supports:

* Category navigation
* Subcategory browsing
* Search
* Dynamic filtering
* Responsive category grids
* Product/category discovery

The implementation uses Axios through the centralized API layer.

---

# Supplier Discovery

StockLinker's supplier discovery experience is designed around business relevance rather than simply displaying a list of stores.

Supplier information can include:

* Supplier name
* Business identity
* Rating
* Distance
* Categories
* Delivery information
* Availability
* Business strength
* Connection options
* Chat
* Store view
* Ordering actions

---

# Price Comparison

Price comparison is a core StockLinker experience.

The UI is designed to help a shopkeeper answer:

> Which supplier gives me the best purchasing option?

Comparison information can include:

```text
Supplier
Price
Availability
Minimum Order
Delivery Time
Rating
```

The interface can surface important decisions such as:

```text
Best Deal
Fastest Delivery
Best Rated
Lowest Price
```

---

# Inventory Experience

Inventory information is presented in a way that helps shopkeepers make purchasing decisions.

The experience can include:

* Current availability
* Stock level
* Minimum order quantity
* Running-low alerts
* Restock suggestions
* Supplier recommendations
* Reorder actions

---

# Order Experience

The frontend supports a wholesale purchasing workflow.

```text
Product
   ↓
Compare
   ↓
Select Supplier
   ↓
Select Quantity
   ↓
Place Order
   ↓
Order Confirmation
   ↓
Order Status
   ↓
Delivery Status
```

The system is designed for wholesale purchasing rather than consumer shopping.

---

# Quantity-Aware Purchasing

Wholesale ordering requires quantity validation.

The frontend is designed to communicate cases such as:

```text
Requested Quantity
        ↓
Supplier Availability
        ↓
Available?
   ┌────┴────┐
   │         │
  YES        NO
   │         │
   ▼         ▼
Continue   Show Minimum /
           Available Quantity
```

This prevents users from submitting unrealistic wholesale quantities.

---

# Order Status

The UI can represent the order lifecycle through clear states.

Conceptually:

```text
PLACED
  ↓
CONFIRMED
  ↓
PROCESSING
  ↓
READY
  ↓
OUT FOR DELIVERY
  ↓
DELIVERED
```

The exact status values are controlled by the backend domain model.

---

# Delivery Tracking

StockLinker is designed to expose delivery progress without forcing the user to rely on external communication.

The frontend can present:

* Delivery status
* Current stage
* Expected delivery information
* Order timeline
* Supplier-side updates

---

# Supplier Messaging

StockLinker includes a dedicated communication experience between buyers and suppliers.

The messaging interface supports:

* Conversations
* Sending messages
* Message status
* Delivered state
* Read state
* Editing messages
* Deleted-message handling
* Unread counts
* Real-time conversation updates

Real-time events are published through:

```text
/topic/conversation/{conversationId}
```

---

# Message Lifecycle

```text
Message Created
      ↓
     SENT
      ↓
  DELIVERED
      ↓
     READ
```

The frontend reflects these states visually so users can understand communication progress.

---

# Responsive Design

StockLinker is designed as a responsive SaaS application.

Supported viewport classes include:

```text
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

The interface is designed to avoid assuming a single fixed desktop layout.

---

# Mobile Design Philosophy

The mobile interface prioritizes:

1. Clear hierarchy
2. Touch-friendly controls
3. Reduced visual noise
4. Important actions close to the user
5. Scrollable content
6. Responsive grids
7. Readable typography
8. Stable navigation
9. Fast interaction
10. Accessible feedback

The design is intended to work on narrow mobile widths as well as larger screens.

---

# Design System

StockLinker follows a premium enterprise SaaS visual language.

Design principles include:

* Clean whitespace
* Strong typography hierarchy
* Subtle borders
* Layered surfaces
* Controlled shadows
* Micro-interactions
* Motion-based feedback
* Consistent iconography
* Responsive spacing
* Focused visual hierarchy

The UI avoids unnecessary visual complexity.

---

# Motion Design

Framer Motion is used for meaningful interaction.

Examples include:

* Page transitions
* Card entrance animations
* Hover interactions
* Modal transitions
* Loading states
* Navigation transitions
* Success states
* Error feedback

Animation should communicate state rather than exist only for decoration.

---

# Component Philosophy

Reusable components are preferred over duplicated UI.

Conceptual structure:

```text
components/
├── common/
├── layout/
├── navigation/
├── products/
├── categories/
├── suppliers/
├── orders/
├── messaging/
├── authentication/
└── ui/
```

The exact project folder structure may evolve as modules grow.

---

# Application Routing

The application separates public and authenticated routes.

## Public

Examples include:

```text
/
login
oauth-success
```

## Authentication

```text
/role-selection
```

## Protected Application

Examples include:

```text
/dashboard
/products
/categories
/suppliers
/orders
/messages
```

The exact route structure is maintained by the application router and may evolve with the product.

---

# Protected Routes

Protected routes follow the authentication state.

Conceptually:

```text
Application
    │
    ▼
AuthProvider
    │
    ▼
Session Hydration
    │
    ├── Loading → Premium Loader
    │
    ├── Authenticated → Application
    │
    └── Unauthenticated → Login
```

The frontend does not redirect prematurely while the initial authentication state is still being resolved.

---

# Project Structure

A conceptual frontend structure:

```text
src/
├── assets/
├── components/
├── config/
├── context/
├── hooks/
├── layouts/
├── pages/
├── routes/
├── services/
├── utils/
├── App.jsx
└── main.jsx
```

Important architectural files include:

```text
src/services/api.js
src/context/AuthContext.jsx
src/routes/PrivateRoute.jsx
src/pages/OAuthSuccess.jsx
src/pages/Login.jsx
src/pages/RoleSelection.jsx
src/config/firebase.js
src/hooks/useAuth.js
```

---

# Environment Variables

Create a local `.env` file.

Example:

```env
VITE_API_URL=http://localhost:8080
```

The Axios base URL becomes:

```text
http://localhost:8080/api
```

For production, use the deployed backend URL.

Example:

```env
VITE_API_URL=https://your-production-backend.example.com
```

Do not commit `.env` files containing secrets.

---

# Firebase Configuration

Phone OTP authentication requires Firebase configuration.

Typical frontend Firebase variables may include:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

Only public Firebase client configuration belongs in frontend environment variables.

Server-side Firebase service-account credentials must never be placed in the frontend.

---

# Local Development

## Requirements

Install:

* Node.js
* npm
* Git
* StockLinker Backend

---

## Clone

```bash
git clone <YOUR_FRONTEND_REPOSITORY_URL>
cd StockLinker-Frontend
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create:

```text
.env
```

Example:

```env
VITE_API_URL=http://localhost:8080
```

---

## Start Development Server

```bash
npm run dev
```

The Vite development server normally runs at:

```text
http://localhost:5173
```

---

# Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# Deployment

The frontend can be deployed independently from the backend.

Typical deployment architecture:

```text
                 Internet
                    │
                    ▼
          ┌──────────────────┐
          │ StockLinker UI   │
          │ React + Vite     │
          └────────┬─────────┘
                   │ HTTPS
                   ▼
          ┌──────────────────┐
          │ StockLinker API  │
          │ Spring Boot      │
          └────────┬─────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
     PostgreSQL          MongoDB
```

The frontend and backend are intentionally maintained as separate repositories and deployment units.

---

# Frontend ↔ Backend Contract

The frontend depends on the StockLinker backend for:

```text
Authentication
Users
Roles
Products
Categories
Suppliers
Inventory
Orders
Invoices
Messaging
Delivery
Business Rules
```

The frontend is responsible for:

```text
Presentation
Interaction
Navigation
Client-side validation
State management
API integration
Responsive UX
Accessibility
Animation
```

The backend remains the source of truth for:

```text
Authentication
Authorization
Business rules
Data validation
Order state
Inventory state
Security
Persistence
```

---

# API Integration Philosophy

The frontend should never duplicate important backend business rules.

For example:

```text
Frontend
  └── User requests quantity = 100
              │
              ▼
Backend
  └── Validates supplier availability
              │
              ├── Allowed
              │
              └── Rejected
```

The frontend presents the result.

The backend makes the authoritative decision.

---

# Error Handling

The frontend should provide clear user-facing feedback for:

* Authentication errors
* Network errors
* Validation errors
* Authorization errors
* Expired sessions
* API failures
* Empty states
* Loading states
* Business-rule errors

Error messages should be understandable without exposing sensitive backend implementation details.

---

# Loading States

The application uses intentional loading states instead of leaving users with blank screens.

Examples:

* Authentication loading
* Page loading
* Product loading
* Category loading
* Supplier loading
* Order loading
* Message loading

Loading experiences should communicate progress while preserving layout stability.

---

# Empty States

Every major data-driven page should handle:

```text
No products
No suppliers
No orders
No conversations
No search results
No categories
No inventory
```

Empty states should guide the user toward the next meaningful action.

---

# Accessibility

The frontend should follow accessible UI practices including:

* Semantic HTML
* Keyboard navigation
* Visible focus states
* Accessible labels
* Sufficient contrast
* Descriptive buttons
* Appropriate ARIA attributes where necessary
* Responsive touch targets

---

# Performance Principles

The frontend aims to minimize unnecessary work through:

* Reusable components
* Memoized derived state where useful
* Centralized API communication
* Controlled rendering
* Lazy loading where appropriate
* Optimized assets
* Avoiding unnecessary API requests
* Efficient list rendering

---

# Security Principles

Frontend security rules include:

### Never store JWTs in localStorage

Authentication cookies are HttpOnly.

### Never expose secrets

Private credentials belong only on the backend.

### Never trust frontend authorization

The backend must enforce authorization.

### Never assume client state is authoritative

Server responses are the source of truth for business state.

### Never expose sensitive errors

Backend implementation details should not be shown directly to users.

---

# Product Experience Philosophy

StockLinker is designed to feel like an enterprise product rather than a traditional CRUD dashboard.

The interface emphasizes:

```text
Clarity
+
Speed
+
Confidence
+
Business Intelligence
+
Trust
```

Every screen should help the user make a decision or complete an action.

---

# Major Frontend Experiences

The application is evolving around several major experiences:

```text
Landing Experience
        │
        ├── Authentication
        │
        ├── Role Selection
        │
        └── Application
              │
              ├── Dashboard
              ├── Product Discovery
              ├── Categories
              ├── Price Comparison
              ├── Supplier Discovery
              ├── Inventory
              ├── Orders
              ├── Delivery
              ├── Messaging
              └── Business Workflows
```

---

# Design Goals

StockLinker aims for:

* Enterprise SaaS quality
* Premium visual hierarchy
* Production-oriented UX
* Responsive behavior
* Fast navigation
* Consistent interaction patterns
* Clear business information
* Minimal unnecessary decoration
* High perceived quality

---

# Development Guidelines

When extending the frontend:

1. Keep business logic out of presentation components.
2. Reuse shared UI components.
3. Keep API calls inside service layers.
4. Do not expose JWT tokens.
5. Keep authentication inside the authentication context/service architecture.
6. Use backend APIs as the source of truth.
7. Maintain responsive behavior.
8. Avoid duplicated logic.
9. Preserve accessibility.
10. Prefer meaningful animation over decorative animation.
11. Keep mobile and desktop experiences equally intentional.
12. Do not introduce TypeScript unless the project architecture is explicitly migrated.

---

# Backend Repository

The frontend depends on the separate StockLinker backend repository.

```text
StockLinker Frontend
        │
        ▼
StockLinker Backend
        │
        ▼
Database / Services
```

Add your actual backend repository URL here after publishing the repository.

---

# Project Status

**Development Status:** Active Development

StockLinker is being built as a complete B2B wholesale commerce ecosystem.

The frontend is continuously evolving alongside backend capabilities including:

* Authentication
* Supplier discovery
* Product discovery
* Price comparison
* Inventory
* Orders
* Delivery
* Messaging
* Business intelligence

---

# License

This project is currently maintained as a private/proprietary project.

Unless explicitly stated otherwise, the source code, UI design, architecture, branding, assets, and business logic are not licensed for redistribution, commercial use, or modification.

---

<p align="center">
  <strong>StockLinker</strong><br/>
  Intelligent wholesale commerce for modern retail.
</p>
