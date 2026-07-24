# Internship Applicant Management API

An administrative portal API built with NestJS to manage, evaluate, filter, and track internship applicants. This system is designed for secure, administrative-only operations using JWT bearer authentication, a persistent Neon PostgreSQL database layer, dynamic query filtering, and real-time dashboard aggregations.

## 🛠️ Technologies Used

- **Framework**: NestJS (v11) with TypeScript
- **Database ORM**: Prisma ORM (v7) with `@prisma/adapter-pg` driver adapter
- **Database Engine**: PostgreSQL (hosted on Neon serverless)
- **Authentication**: Passport.js with JSON Web Tokens (`@nestjs/jwt` + `@nestjs/passport`)
- **Password Hashing**: argon2
- **Validation**: class-validator & class-transformer (strict global payload filtering)
- **Documentation**: Swagger OpenAPI (exposed at `/api/docs`)
- **Package Manager**: pnpm
- **Testing**: Jest (unit testing)

## 📦 Getting Started & Setup

Follow these exact steps to clone, configure, migrate, seed, and run the application locally.

### 1. Prerequisite Installations

Ensure you have the following installed on your local system:

- Node.js (v18 or higher recommended)
- pnpm (`npm i -g pnpm`)

### 2. Configure Environment Variables

Copy the template `.env.example` file to create your active environment configuration:

```bash
cp .env.example .env
```

Open the newly created `.env` file and replace the placeholder variables with your active `DATABASE_URL` (Neon PostgreSQL connection string) and a secure `JWT_SECRET`.

### 3. Install Project Dependencies

```bash
pnpm install
```

### 4. Apply Database Migrations

Synchronize your Neon cloud database schema with your local Prisma definitions:

```bash
pnpm prisma migrate dev
```

### 5. Seed the Database

Run the seed script to populate your database with an administrator account and mock applicant records across various statuses:

```bash
pnpm prisma db seed
```

### 6. Run the Application

```bash
pnpm run start:dev
```

The application will launch on port 3000 (or your custom `$PORT` environment variable).

- **Interactive API Documentation (Swagger)**: [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## 🔒 Authentication & API Usage

Only authenticated administrators are authorized to access applicant records, change status, update notes, or view dashboard summaries.

### Local Administrative Credentials

The seed script configures a default administrator with the following credentials:

- **Email**: admin@example.com
- **Password**: secure_password_123

### Authentication Flow in Swagger UI

1. Open the Swagger interface at http://localhost:3000/api/docs.
2. Expand the **Authentication** category and click the `POST /api/auth/login` endpoint.
3. Click **"Try it out"**, enter the default credentials, and click **"Execute"**.
4. Copy the `access_token` string from the JSON response.
5. Scroll to the top of the page, click the green **"Authorize"** button, paste your copied token into the text field, and click **Authorize**.
6. The lock icons next to all protected routes will close. You are now authenticated to execute protected calls directly inside the browser.

## 📐 Architecture Summary

This API is built using NestJS's modular conventions, separating features into isolated, maintainable domains:

- **PrismaModule**: Encapsulates a global `PrismaService` which extends `PrismaClient` using the `@prisma/adapter-pg` driver adapter for connection handling.
- **AuthModule**: Manages credential checking using argon2 hashing, JWT generation, and Passport strategy extraction.
- **ApplicantsModule**: Handles core CRUD logic, DTO mapping, dynamic filtering, and soft-delete updates.
- **DashboardModule**: Computes real-time applicant counts via database aggregation.

### Key Architectural Decisions

- **Why soft-delete is a flag**: A `deletedAt` timestamp is set rather than using Prisma's `.delete()`. This preserves record history and referential integrity while keeping deleted records fully hidden from standard lists and calculations.
- **Separated status & notes endpoints**: Status and notes modifications are decoupled from the generic `PATCH /api/applicants/:id` update. They're exposed on dedicated `PATCH :id/status` and `PATCH :id/notes` endpoints, ensuring a status change always runs through the state-machine guard and a note update can't bypass validation or overwrite unrelated fields.

## 🚦 Business Rules & Limitations

### 1. Status-Transition Guard (State Machine)

To prevent invalid administrative evaluations, a strict state-machine guard is enforced on `PATCH /api/applicants/:id/status`:

- Forbidden: Rejected → Accepted
- Forbidden/Allowed?: Rejected → Shortlisted
- Forbidden/Allowed?: Accepted → Pending

Attempting a forbidden transition returns a `400 Bad Request` with an explicit description of the violation. All other transitions (e.g., Pending → Shortlisted, Pending → Rejected) are supported.

### 2. Known Scoping Limitations

- **Email collision on re-creation**: The `Applicant` table enforces a unique constraint on `email`. Because soft-deleted applicants remain in the database with their unique email intact, you cannot create a new applicant with the same email as a soft-deleted one — doing so returns a `409 Conflict`. This is a deliberate scoping decision rather than an oversight: restoring a soft-deleted applicant on re-creation was considered and deferred as a possible future enhancement.

## 🧪 Automated Testing

Targeted, critical test coverage over arbitrary test-volume metrics — prioritizing security, data-boundary, and business-logic behaviors.

### Executing Tests

```bash
pnpm test
```

### What Is Covered

- **Email uniqueness**: verifies that a Prisma `P2002` duplicate-key error is caught and rethrown as a clean `ConflictException`, not a leaked database error.
- **State-machine transition checks**: asserts valid transitions succeed and forbidden transitions throw `BadRequestException`.
- **Soft-delete exclusion**: asserts that a soft-deleted applicant returns a clean `404 NotFoundException` on lookup, making them fully invisible to standard administrative interfaces.
- **Notes length constraints**: asserts that notes exceeding 1,000 characters fail `class-validator` validation cleanly.
