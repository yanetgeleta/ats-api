# Internship Applicant Management API

An administrative portal API built with NestJS to manage, evaluate, filter, and track internship applicants. This system is designed for secure, administrative-only operations using JWT bearer authentication, persistent Neon PostgreSQL database layers, dynamic query filtering, and real-time dashboard aggregations.

---

## 🛠️ Technologies Used

- **Framework**: NestJS (v11) with TypeScript
- **Database ORM**: Prisma ORM (v7) with `@prisma/adapter-pg` driver adapter
- **Database Engine**: PostgreSQL (Hosted on Neon serverless)
- **Authentication**: Passport.js with JSON Web Tokens (`@nestjs/jwt` + `@nestjs/passport`)
- **Password Hashing**: `argon2`
- **Validation**: Class-Validator & Class-Transformer (Strict global payload filtering)
- **Documentation**: Swagger OpenAPI (Exposed at `/api/docs`)
- **Package Manager**: `pnpm`
- **Testing**: Jest Unit Testing

---

## 📦 Getting Started & Setup

Follow these exact steps to clone, configure, migrate, seed, and run the application locally.

### 1. Prerequisite Installations

Ensure you have the following installed on your local system:

- **Node.js** (v18 or higher recommended)
- **pnpm** (`npm i -g pnpm`)

### 2. Configure Environment Variables

Copy the template `.env.example` file to create your active environment configuration:

```bash
cp .env.example .env
```
