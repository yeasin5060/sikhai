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
| POST | `/api/auth/google` | Public | Verify a Google credential and sign in or create a student account |
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

The Vite client uses Axios and `VITE_API_URL` (defaults to `http://localhost:5000/api` only in development). In the client Vercel project, set `VITE_API_URL` to the deployed server URL ending in `/api`, then redeploy the client. Set the server Vercel project's `CLIENT_ORIGIN` to the exact client origin (for example, `https://sikhai-black.vercel.app`). Existing browser accounts, courses, and enrollments are not migrated automatically; register accounts again and seed courses with the command above.

## Google student sign-in

Create a Google OAuth 2.0 Web application client ID in Google Cloud Console. Add each frontend origin to Authorized JavaScript origins, such as `http://localhost:5173` and the exact deployed frontend origin. Enter only the scheme, host, and optional port; do not include a path or the API URL. Set `VITE_GOOGLE_CLIENT_ID` in the client environment and `GOOGLE_CLIENT_ID` in the API environment to that same client ID, then redeploy both apps. The API verifies Google's signed ID token before creating or signing in a student account. A verified Google email matching an existing student account is linked automatically; Google sign-in is not enabled for admin accounts.

For Vercel, set `GOOGLE_CLIENT_ID` in the **API project's** Settings → Environment Variables for each deployment environment you use, then redeploy that project. Setting `VITE_GOOGLE_CLIENT_ID` in the client project only configures the browser button; it does not configure the API. The client deployment also sends `Cross-Origin-Opener-Policy: same-origin-allow-popups` for Google's popup flow.
