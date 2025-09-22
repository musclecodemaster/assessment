
📋 Setup Instructions
Backend setup with both ts-node and Nx options

Frontend setup with http-server

Prerequisites and dependencies

Quick test procedure

🏗️ Architecture Overview
Complete monorepo structure visualization

Technology stack breakdown

Nx workspace organization

Frontend/backend separation

🔐 Access Control Design
Authentication flow explanation

Role-based authorization system

Permission matrix table

Multi-tenant architecture details

Security guards implementation

📊 Data Models
Entity relationship diagram

Complete TypeScript entity definitions

Database schema explanations

Enums and constants

📡 API Documentation
All endpoint specifications

POST /api/auth/register - User registration
POST /api/auth/login    - User login
GET  /api/tasks         - List tasks
POST /api/tasks         - Create task
GET  /api/audit-logs    - View audit logs


Request/response examples

# Test registration Request:
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "organizationName": "Test Organization"
  }'

Response: 

{"access_token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInJvbGUiOiJPd25lciIsIm9yZ2FuaXphdGlvbklkIjoxLCJpYXQiOjE3NTg1NjIwNTQsImV4cCI6MTc1ODY0ODQ1NH0.lTIN9nDp3KZQ_-ntYhX_byMWoPbG_HCVAYwLN9sDWds","user":{"id":1,"username":"testuser","email":"test@example.com","role":"Owner"}}%         
  

Sample curl commands

POST /api/auth/login
Login with existing credentials

curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "password123"
  }'

  GET /api/tasks
Get all tasks (requires Bearer token)

curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"


🚀 Future Enhancements
Security improvements (MFA, rate limiting, etc.)

Scalability enhancements (microservices, caching)

Feature extensions (real-time updates, file uploads)

DevOps & deployment strategies

Code quality & testing improvements

Compliance & governance features

=======
# Secure Task Management System

## Overview

This project implements a secure task management system using an NX monorepo with a NestJS backend and Angular frontend. It features role-based access control (RBAC), JWT authentication, and a responsive UI styled with TailwindCSS. The system supports users managing tasks within a two-level organizational hierarchy, with roles (Owner, Admin, Viewer) controlling access.

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- NX CLI (`npm install -g nx`)
- SQLite (or PostgreSQL for production)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd assessment
   ```

2. Install dependencies:

   ```bash
   npm install
   npm install --save @nestjs/common @nestjs/core @nestjs/platform-express @nestjs/typeorm @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt typeorm sqlite3 bcrypt @nestjs/testing jest ts-jest
   ```

3. Set up environment variables:
   - Create `.env` in `apps/api`:

     ```bash
     JWT_SECRET=your_jwt_secret_key
     DATABASE_URL=sqlite://./task-management.sqlite
     ```

4. Run database migrations:

   ```bash
   nx run api:typeorm
   ```

5. Start the backend:

   ```bash
   nx serve api
   ```

6. Start the frontend:

   ```bash
   nx serve dashboard
   ```

7. Access the app at `http://localhost:4200`.

To resolve TypeScript module errors, ensure the `tsconfig.base.json` includes the paths for shared libraries as shown in the provided artifact. If errors persist, run `nx reset` or delete `node_modules` and reinstall.

## Architecture Overview

The project uses an NX monorepo for modularity and shared code:

- **apps/api**: NestJS backend with TypeORM and SQLite/PostgreSQL.
- **apps/dashboard**: Angular frontend with TailwindCSS for styling.
- **libs/data**: Shared TypeScript interfaces and DTOs.
- **libs/auth**: Reusable RBAC logic, guards, and decorators.

This structure promotes code reuse, enforces separation of concerns, and simplifies scaling by isolating backend and frontend concerns while sharing common logic.

## Data Model

### Entities

- **User**: Stores user details (id, email, password, organizationId, roleId).
- **Organization**: Represents a two-level hierarchy (id, name, parentId).
- **Role**: Defines roles (Owner, Admin, Viewer) with associated permissions.
- **Permission**: Maps roles to allowed actions (e.g., create_task, edit_task).
- **Task**: Stores task details (id, title, description, category, status, userId, organizationId).
- **AuditLog**: Tracks access events (id, userId, action, timestamp).

### ERD

```
[User] 1 ---- M [Task]
[User] 1 ---- 1 [Role]
[User] 1 ---- 1 [Organization]
[Organization] 1 ---- M [Task]
[Role] 1 ---- M [Permission]
[User] 1 ---- M [AuditLog]
[Organization] 1 ---- M [Organization] (self-referential, parentId)
```

## Access Control Design

- **RBAC**: Implemented using custom NestJS guards (`RoleGuard`) and decorators (`@Roles`, `@Permissions`). Roles inherit permissions (Owner > Admin > Viewer).
- **Organization Hierarchy**: Users can only access tasks within their organization or its children.
- **Task Scoping**: Viewers see only their tasks; Admins see all tasks in their org; Owners see all tasks in their org and child orgs.
- **JWT Authentication**: All endpoints require a valid JWT, verified by `AuthGuard`. Tokens include userId, role, and organizationId.
- **Audit Logging**: Logs actions (e.g., task creation, deletion) to the console and database, accessible only to Owners/Admins.

## API Documentation

### Authentication

- **POST /auth/login**
  - Request: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "access_token": "jwt_token" }`
- All endpoints require `Authorization: Bearer <token>`.

### Task Endpoints

- **POST /tasks**
  - Request: `{ "title": "Task 1", "description": "Details", "category": "Work" }`
  - Response: `{ "id": 1, "title": "Task 1", ... }`
  - Permissions: `create_task` (Owner, Admin)
- **GET /tasks**
  - Response: `[{ "id": 1, "title": "Task 1", ... }, ...]`
  - Permissions: Scoped to role/org
- **PUT /tasks/:id**
  - Request: `{ "title": "Updated Task", "status": "Done" }`
  - Response: `{ "id": 1, "title": "Updated Task", ... }`
  - Permissions: `edit_task` (Owner, Admin, or task owner)
- **DELETE /tasks/:id**
  - Response: `{ "message": "Task deleted" }`
  - Permissions: `delete_task` (Owner, Admin)
- **GET /audit-log**
  - Response: `[{ "id": 1, "userId": 1, "action": "Task created", "timestamp": "2025-09-18T19:00:00Z" }, ...]`
  - Permissions: `view_audit_log` (Owner, Admin)

## Future Considerations

- **Advanced Role Delegation**: Allow Owners to assign custom roles dynamically.
- **Security Enhancements**: Implement JWT refresh tokens, CSRF protection, and rate limiting.
- **Performance**: Cache RBAC checks using Redis for scalability.
- **UI/UX**: Add task completion charts, dark mode, and keyboard shortcuts.
- **Testing**: Increase test coverage for edge cases in RBAC and UI interactions.

## Testing

- **Backend**: Jest tests for RBAC logic, authentication, and API endpoints (see `apps/api/src/__tests__`).

**Frontend**: Karma/Jest tests for components and state management (see `apps/dashboard/src/app/__tests__`).
