Open the newly created .env file and replace the placeholder variables with your active **DATABASE\_URL** (Neon PostgreSQL connection string) and a secure **JWT\_SECRET**.

### 3\. Install Project Dependencies

Run the installation command to populate your local node\_modules folder:

codeBash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pnpm install   `

### 4\. Apply Database Migrations

Synchronize your Neon cloud database schema with your local Prisma definitions:

codeBash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pnpm prisma migrate dev   `

### 5\. Seed the Database

Run the seed script to automatically populate your database with an administrator account and 8 mock applicant records across various statuses:

codeBash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pnpm prisma db seed   `

### 6\. Run the Application

Start the NestJS development server:

codeBash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pnpm run start:dev   `

The application will launch on port 3000 (or your custom defined $PORT environment variable).

- **Interactive API Documentation (Swagger)**: Access the documentation page at [http://localhost:3000/api/docs](https://www.google.com/url?sa=E&q=http://localhost:3000/api/docs).

🔒 Authentication & API Usage
-----------------------------

Only authenticated administrators are authorized to access applicant records, change status, update notes, or view dashboard summaries.

### Local Administrative Credentials

The seed script configures a default administrator with the following credentials:

- **Email**: admin@example.com

- **Password**: secure\_password\_123

### Authentication Flow in Swagger UI

1.  Open the Swagger interface at http://localhost:3000/api/docs.

2.  Expand the **Authentication** category and click the POST /api/auth/login endpoint.

3.  Click **"Try it out"**, enter the default credentials, and click **"Execute"**.

4.  Copy the long access\_token string from the JSON response.

5.  Scroll to the top of the webpage, click the green **"Authorize"** button, paste your copied token into the text field, and click **Authorize**.

6.  The lock icons next to all protected routes will close. You are now authenticated to execute protected calls directly inside the browser.

📐 Architecture Summary
-----------------------

This API is designed using NestJS's modular conventions, separating features into isolated, maintainable domains:

- **PrismaModule**: Encapsulates a global PrismaService which extends PrismaClient using the native Prisma 7 @prisma/adapter-pg driver adapter to allow robust connection boundaries.

- **AuthModule**: Manages credential checking using argon2 secure hashing, JWT generation, and Passport Strategy extraction.

- **ApplicantsModule**: Handles core CRUD logic, DTO mapping, dynamic filtering, and soft-delete updates.

- **DashboardModule**: Connects a high-performance database grouping and aggregation query to compute real-time counts.

### Key Architectural Decisions

- **Why Soft-Delete is a Flag**: We update a deletedAt DateTime timestamp rather than using Prisma's .delete() method. This maintains record history and preserves referential integrity for potential audit trails while keeping deleted records entirely hidden from standard lists and calculations.

- **Separated Status & Notes Endpoints**: Status and notes modifications are decoupled from generic PATCH /api/applicants/:id updates. They are exposed on dedicated PATCH :id/status and PATCH :id/notes endpoints. This ensures that changing a status forces a run through the state-machine rules, and adding a note cannot bypass validation limits or accidentally overwrite non-related fields.

🚦 Business Rules & Limitations
-------------------------------

### 1\. Status-Transition Guard (State-Machine)

To prevent invalid administrative evaluations, we enforce a strict state-machine guard during PATCH /api/applicants/:id/status operations:

- **Forbidden Transitions**:

  - →→ ACCEPTED

  - →→ SHORTLISTED

  - →→ PENDING

- Attempting to bypass these boundaries returns a 400 Bad Request with an explicit description of the violation. All other status transitions (e.g., transitioning a PENDING applicant to SHORTLISTED or REJECTED) are fully supported.

### 2\. Known Scoping Limitations

- **Email Collision on Re-creation**: Our schema enforces that email must be unique on the Applicant table. Because soft-deleted applicants are kept in the database with their unique email fields intact, **you cannot create a new applicant with the same email as a soft-deleted applicant**. If an application is deleted, it blocks re-creation of that email unless hard-deleted from the database manually. This is a deliberate design choice to prevent duplicate applicant hijacking.

🧪 Automated Testing
--------------------

We prioritize **targeted, critical test coverage** to verify key security, data boundary, and business logic behaviors over arbitrary test-volume metrics.

### Executing Tests

Run your test suites in your terminal using:

codeBash

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   pnpm test   `

### What is Covered

Our unit test coverage specifically tests our high-risk logic boundaries:

- **Email Uniqueness**: Verifies that when Prisma returns a P2002 duplicate unique key error, the service captures it and rethrows a clean ConflictException instead of leaking database errors.

- **State-Machine Transition Checks**: Asserts that valid transitions update correctly while forbidden transitions are blocked and throw BadRequestException.

- **Soft-Delete Exclusion**: Asserts that when an applicant is soft-deleted, performing a single findOne lookup on their ID returns a clean 404 NotFoundException (making them completely invisible to standard administrative interfaces).

- **Notes Length Constraints**: Direct, unit-level validation assertions of UpdateNotesDto ensuring that comments exceeding 1,000 characters fail class-validator requirements cleanly.
