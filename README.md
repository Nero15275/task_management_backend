# Task Management Backend

A production-ready Task Management Backend built with **Node.js**, **Express**, **TypeScript**, and **MongoDB**. The project follows clean architecture principles and includes authentication, role-based authorization, validation, logging, and scalable API design.

## 🚀 Features

- JWT Authentication
- Role-Based Access Control (RBAC)
- User Management
- Task Management
- Request Validation using Zod
- Secure Password Hashing with bcrypt
- Cookie-based Authentication
- HTTP Security using Helmet
- Response Compression
- Request Logging with Pino
- Environment Configuration with dotenv
- MongoDB with Mongoose
- Centralized Error Handling
- RESTful API Design
- Scalable Project Structure
- TypeScript Support

## 👥 Roles

### Manager

- Create users
- View all users
- View all tasks
- Create tasks
- Update any task
- Reassign tasks
- Assign tasks to self
- View Team Leads and their tasks

### Team Lead

- View own team members
- Create tasks
- Assign tasks to team members
- Update tasks assigned to self or team members
- View team tasks

### Team Member

- View assigned tasks
- Update task status
- View own profile

---

## 🛠 Tech Stack

### Backend

- Node.js
- Express.js
- TypeScript

### Database

- MongoDB
- Mongoose

### Authentication

- JSON Web Token (JWT)
- bcrypt

### Validation

- Zod

### Security

- Helmet
- CORS
- Cookie Parser

### Logging

- Pino
- Pino Pretty

### Utilities

- dotenv
- compression

---

## 📂 Project Structure

```
src/
├── config/
├── common/
├── middleware/
├── modules/
│   ├── auth/
│   ├── users/
│   └── tasks/
├── routes/
├── services/
├── utils/
├── types/
└── app.ts
```

---

## ⚙️ Installation

```bash
git clone https://github.com/<your-username>/task-management-backend.git

cd task-management-backend

npm install
```

---

## Environment Variables

Create a `.env` file.

```env
PORT=5000

MONGO_URI=

JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

NODE_ENV=development
```

---

## Running the Project

Development

```bash
npm run dev
```

Build

```bash
npm run build
```

Production

```bash
npm start
```

---

## API Status

- [ ] Authentication
- [ ] User Management
- [ ] Task Management
- [ ] Role-Based Authorization
- [ ] Validation
- [ ] Logging
- [ ] Error Handling
- [ ] Swagger Documentation

---

## Future Improvements

- Refresh Token Rotation
- Email Verification
- Password Reset
- File Uploads
- Notifications
- Redis Caching
- Rate Limiting
- Docker Support
- CI/CD Pipeline
- Unit & Integration Testing
- API Documentation with Swagger
- Audit Logs

---

## License

This project is licensed under the MIT License.
