# Todo List API

A RESTful API for managing todo lists with user authentication, built with Node.js, Express, and PostgreSQL.

## Features

- 🔐 User Authentication (JWT)
- ✨ CRUD Operations for Todos
- 📄 Pagination & Filtering
- 🛡️ Security Features (Helmet, Rate Limiting, CORS)
- 📚 API Documentation (Swagger)
- ✅ Unit & Integration Tests (Jest)

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL, Sequelize ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Testing**: Jest, Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, Express-rate-limit, CORS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd todo-list-api
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Configure your `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/todo_db

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
CORS_ORIGIN=*
```

5. Set up the database:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE todo_db"

# Run migrations
npm run migrate
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication Endpoints

| Method | Endpoint         | Description          |
| ------ | ---------------- | -------------------- |
| POST   | `/auth/register` | Register a new user  |
| POST   | `/auth/login`    | Login user           |
| POST   | `/auth/refresh`  | Refresh access token |

### Todo Endpoints

| Method | Endpoint     | Description     | Query Parameters                               |
| ------ | ------------ | --------------- | ---------------------------------------------- |
| GET    | `/todos`     | Get all todos   | `page`: Page number<br>`limit`: Items per page |
| GET    | `/todos/:id` | Get single todo | -                                              |
| POST   | `/todos`     | Create todo     | -                                              |
| PUT    | `/todos/:id` | Update todo     | -                                              |
| DELETE | `/todos/:id` | Delete todo     | -                                              |

#### Pagination Response Format

```json
{
  "data": [...todos],
  "pagination": {
    "totalItems": 100,
    "totalPages": 10,
    "currentPage": 1,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## Development

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Deployment

### Production Setup

1. Set production environment variables
2. Build the application:

```bash
npm run build
```

3. Start production server:

```bash
npm start
```

### Docker Deployment

```bash
# Build image
docker build -t todo-api .

# Run container
docker run -p 5000:5000 todo-api
```
