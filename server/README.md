# Shikhai API

Express and MongoDB API for the Shikhai learning platform.

## Setup

1. Install Node.js, then run `npm install` in this directory.
2. Copy `.env.example` to `.env` and set `MONGODB_URI`, a long random `JWT_SECRET`, and the allowed frontend origin(s) in `CLIENT_ORIGIN`.
3. Run `npm run seed:admin` with `ADMIN_NAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` configured in `.env`.
4. Run `npm run seed:courses` to add the starter courses to MongoDB.
5. Start the API with `npm run dev` (or `npm start` for production).

The API listens on port `5000` by default. MongoDB must be running and reachable through `MONGODB_URI`.

## Routes

| Method | Route | Access | Purpose |
| --- | --- | --- | --- |
| GET | `/api/health` | Public | Health check |
| POST | `/api/auth/register` | Public | Create a student account |
| POST | `/api/auth/login` | Public | Log in and receive a JWT |
| GET | `/api/auth/me` | Signed in | Current account |
| GET | `/api/courses` | Public | List published courses |
| GET | `/api/courses/:id` | Public | Read a published course |
| POST | `/api/courses` | Admin | Create a course |
| PATCH | `/api/courses/:id` | Admin | Update a course |
| DELETE | `/api/courses/:id` | Admin | Delete a course and its enrollments |
| GET | `/api/admin/students` | Admin | List students and enrolled course ids |
| GET | `/api/admin/enrollments` | Admin | List enrollments with student and course details |
| GET | `/api/enrollments/me` | Signed in | Current student's enrollments |
| POST | `/api/enrollments/:courseId` | Signed in | Enroll in a published course |
| DELETE | `/api/enrollments/:courseId` | Signed in | Cancel an enrollment |

Send protected requests with `Authorization: Bearer <token>`. Register and login return `{ user, token }`; course and enrollment endpoints return named objects in JSON responses.

## Client integration

The Vite client uses Axios and `VITE_API_URL` (defaults to `http://localhost:5000/api`). Copy `client/.env.example` to `client/.env` to configure a different API URL. Existing browser accounts, courses, and enrollments are not migrated automatically; register accounts again and seed courses with the command above.
