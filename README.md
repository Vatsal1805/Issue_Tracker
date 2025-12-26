# ApniSec - Cybersecurity Issue Management Platform

<div align="center">
  <h3>Professional Cybersecurity Issue Tracking & Management</h3>
  <p>A full-stack web application for managing cybersecurity incidents and assessments</p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
  ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
  ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
  ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
</div>

> **⚠️ This project strictly follows Object-Oriented Programming (OOP) principles as a mandatory requirement. All backend logic is implemented using class-based handlers, services, repositories, validators, and dependency injection.**

## Project Overview

ApniSec is a professional cybersecurity issue management platform designed for security teams to efficiently track, manage, and resolve cybersecurity incidents. The platform provides a comprehensive solution for managing various types of security assessments including Cloud Security, Red Team Assessments, and Vulnerability Assessment & Penetration Testing (VAPT).

## Features

### Authentication & Authorization
- **Secure User Registration** with email validation
- **JWT-based Authentication** with secure session handling
- **Password Security** using bcrypt hashing
- **Protected Routes** with middleware authentication

### Dashboard & Analytics
- **Dashboard Statistics** showing resolved, in-progress, and high-priority issues
- **Recent Issues Overview** with quick access to latest incidents
- **Quick Actions** for rapid issue management
- **Responsive Design** using modern CSS utilities

### Issue Management
- **Create Issues** with detailed descriptions and categorization
- **Issue Types**: Cloud Security, Red Team Assessment, VAPT
- **Priority Levels**: Low, Medium, High
- **Status Tracking**: Open, In Progress, Resolved, Closed
- **Advanced Filtering** by type
- **Issue Deletion** with confirmation dialogs

### User Interface
- **Modern Dark Theme** with cybersecurity aesthetics
- **Responsive Design** using Tailwind CSS
- **Professional Landing Page** with SEO optimization
- **Intuitive Navigation** with clear structure
- **Loading States** and error handling

### SEO Optimization
- **Lighthouse Score: 100%** 
- **Semantic HTML** markup for better accessibility
- **Meta Tags** optimization for social media sharing
- **Sitemap Generation** for better search engine indexing
- **Open Graph** and Twitter Card support

## Tech Stack

### Frontend
- **Next.js (App Router)** - React framework with App Router
- **React (latest stable version)** - UI library with latest features
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web framework with strict OOP architecture
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT (jsonwebtoken)** - Authentication tokens
- **bcrypt** - Password hashing and security
- **dotenv** - Environment variable management
- **Rate Limiting** - API protection middleware

## OOP Architecture Explanation

The backend follows a strict **Object-Oriented Programming (OOP)** paradigm with clear separation of concerns:

### Design Patterns Used:
- **Repository Pattern** - Data access abstraction
- **Service Pattern** - Business logic encapsulation  
- **Handler Pattern** - Request/response handling
- **Dependency Injection** - Loose coupling through constructor injection
- **Error Handling Strategy** - Custom error classes with inheritance

### Key OOP Principles:
- **Encapsulation** - Data and methods bundled in classes
- **Inheritance** - Error classes extending base ApiError
- **Polymorphism** - Interface-based programming
- **Abstraction** - Service interfaces hiding implementation details

### Class Structure:
```javascript
// Handler Layer - Request/Response Management
class IssueHandler {
  constructor(issueService) {
    this.issueService = issueService; // Dependency Injection
  }
  async createIssue(req, res, next) { /* ... */ }
}

// Service Layer - Business Logic
class IssueService {
  constructor(issueRepository) {
    this.issueRepository = issueRepository;
  }
  async createIssue(data, userID) { /* Business Logic */ }
}

// Repository Layer - Data Access
class IssueRepository {
  async createIssue(issueData) { /* Database Operations */ }
}

// Custom Error Classes
class ApiError extends Error {
  constructor(statusCode, message) { /* Error Handling */ }
}
```

## Backend Folder Structure

```
backend/
├── src/
│   ├── handlers/          # Request handlers (Controller layer)
│   │   ├── AuthHandler.js
│   │   └── IssueHandler.js
│   ├── services/          # Business logic layer
│   │   ├── AuthService.js
│   │   └── IssueService.js
│   ├── repositories/      # Data access layer
│   │   ├── UserRepository.js
│   │   └── IssueRepository.js
│   ├── models/           # MongoDB schemas
│   │   ├── User.js
│   │   └── Issue.js
│   ├── routes/           # Express routes
│   │   ├── AuthRoutes.js
│   │   └── issueRoutes.js
│   ├── middlewares/      # Custom middleware
│   │   ├── AuthMiddleware.js
│   │   └── rateLimiter.middleware.js
│   ├── errors/           # Custom error classes
│   │   └── Apierror.js
│   ├── utils/            # Utility functions
│   │   └── jwt.util.js
│   ├── config/           # Configuration files
│   ├── app.js            # Express app configuration
│   └── server.js         # Server initialization
├── .env                  # Environment variables
└── package.json
```

## Frontend Folder Structure

```
frontend/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── dashboard/    # Dashboard page
│   │   ├── issues/       # Issues management
│   │   ├── profile/      # User profile
│   │   ├── login/        # Authentication
│   │   ├── register/     # User registration
│   │   ├── create-issue/ # Issue creation
│   │   ├── layout.js     # Root layout with SEO
│   │   └── page.js       # Landing page
│   ├── components/       # Reusable components
│   │   └── ProtectedRoute.js
│   ├── contexts/         # React contexts
│   │   └── AuthContext.js
│   ├── lib/             # Utility libraries
│   │   └── api.js       # API service layer
│   └── styles/          # Global styles
├── public/              # Static assets
├── next.config.mjs      # Next.js configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## Authentication Flow

### Registration Process:
1. **User Registration** → Validation → Password Hashing → Database Storage
2. **JWT Token Generation** → Response with user data and token
3. **Automatic Login** → Context update and redirection

### Login Process:
1. **Credential Validation** → Password verification with bcrypt
2. **JWT Token Generation** → Secure token with expiration
3. **Context Authentication** → Global state management
4. **Protected Route Access** → Middleware verification

### Token Management:
```javascript
// JWT Structure
{
  "id": "user_mongodb_id",
  "iat": "issued_at_timestamp",
  "exp": "expiration_timestamp"
}
```

## Issue Management Module

### Issue Schema:
```javascript
{
  title: String,           // Issue title
  description: String,     // Detailed description
  type: Enum,             // "Cloud Security" | "Red Team Assessment" | "VAPT"
  priority: Enum,         // "Low" | "Medium" | "High"
  status: Enum,           // "Open" | "In Progress" | "Resolved" | "Closed"
  createdBy: ObjectId,    // Reference to User
  createdAt: Date,        // Creation timestamp
  updatedAt: Date         // Last update timestamp
}
```

### Workflow:
1. **Issue Creation** → Validation → Database Storage → Dashboard Update
2. **Issue Filtering** → Type-based filtering for better organization
3. **Issue Deletion** → Confirmation → Soft/Hard delete → State update

## SEO Optimization

### Performance Metrics:
- **Lighthouse Score: 100%** 
- **Core Web Vitals** SEO-focused performance optimizations
- **Server-Side Rendering** with Next.js App Router


### SEO Features:
- **Semantic HTML** markup for accessibility
- **Meta Tags** for social media sharing
- **Sitemap** generation for search engines
- **Robots.txt** configuration

## API Endpoints

### Authentication Endpoints:
```http
POST   /api/auth/register     # User registration
POST   /api/auth/login        # User login
POST   /api/auth/logout       # User logout
GET    /api/auth/me           # Get current user
```

### Issue Management Endpoints:
```http
POST   /api/issues            # Create new issue
GET    /api/issues            # Get user issues
PUT    /api/issues/:id        # Update specific issue
DELETE /api/issues/:id        # Delete specific issue
```

### Request/Response Examples:
```javascript
// Create Issue Request
POST /api/issues
{
  "title": "SQL Injection Vulnerability",
  "description": "Critical security flaw in login portal",
  "type": "VAPT",
  "priority": "High"
}

// Response
{
  "_id": "64a1b2c3d4e5f6789",
  "title": "SQL Injection Vulnerability",
  "description": "Critical security flaw in login portal",
  "type": "VAPT",
  "priority": "High",
  "status": "Open",
  "createdBy": "64a1b2c3d4e5f6123",
  "createdAt": "2025-12-25T10:00:00Z",
  "updatedAt": "2025-12-25T10:00:00Z"
}
```

## Setup Instructions

### Prerequisites:
- **Node.js** (v18 or higher)
- **MongoDB** (local or cloud instance)
- **Git** for version control
- **npm** or **yarn** package manager

### Installation:

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/apnisec.git
cd apnisec
```

2. **Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
npm start
```

3. **Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

4. **Database Setup:**
```bash
# MongoDB connection will be established automatically
# Ensure MongoDB is running locally or configure cloud URI
```

## Environment Variables

### Backend (.env):
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name

# Authentication
JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRES_IN=24h

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=15  # minutes
RATE_LIMIT_MAX=100    # requests per window
```

### Frontend (.env.local):
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# SEO Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=ApniSec
```

## Deployment

### Backend Deployment (Node.js):
```bash
# Build for production
npm run build

# Start production server
npm start

# Or using PM2
pm2 start src/server.js --name "apnisec-backend"
```

### Frontend Deployment (Vercel/Netlify):
```bash
# Build for production
npm run build

# Start production server
npm start

# Or deploy to Vercel
vercel --prod
```

## Security Features

### Backend Security:
- **Rate Limiting** to prevent API abuse
- **JWT Token Validation** on protected routes
- **Password Hashing** with bcrypt (10 rounds)
- **Input Sanitization** and validation
- **CORS Configuration** for cross-origin requests

### Frontend Security:
- **Client-side Token Storage** with secure practices
- **Protected Routes** with authentication guards
- **XSS Prevention** with React's built-in protection

---

**ApniSec Issue Management Platform** - Built with Next.js, Express.js, and MongoDB following strict OOP principles.