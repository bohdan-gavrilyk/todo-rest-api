# Todo REST API

REST API for task management built with Express, TypeScript, Prisma and PostgreSQL.

## Tech Stack

- Node.js
- Express
- TypeScript
- PostgreSQL
- Prisma ORM
- Zod
- Vitest
- Supertest

## Architecture

Request
→ Router
→ Validation Middleware
→ Controller
→ Service
→ Repository
→ Prisma
→ PostgreSQL

## Features

- Create tasks
- Get all tasks
- Get task by ID
- Update tasks
- Delete tasks
- Filter by completed status
- Filter by priority
- Sort by ID
- Sort by priority
- Request validation
- Global error handling
- Integration tests
- Separate test database

## Project Structure

src/
├── controller/
├── services/
├── repositories/
├── routes/
├── middleware/
├── schemas/
├── types/
├── lib/
├── generated/
├── app.ts
└── server.ts

prisma/
├── migrations/
├── schema.prisma
└── seed.ts

## Environment Variables

Create `.env`:

DATABASE_URL=
DIRECT_URL=
TEST_DATABASE_URL=
TEST_DIRECT_URL=

## Installation

npm install

npx prisma generate

npx prisma migrate dev

npm run db:seed

## Run Development Server

npm run dev

## Tests

npm test

## API

GET /tasks

GET /tasks/:id

POST /tasks

PATCH /tasks/:id

DELETE /tasks/:id