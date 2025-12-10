# MindMatrics
MindMatrics is an educational quiz platform that helps students test their knowledge across various subjects through interactive quizzes and performance analytics. This repository contains a Node/Express backend (API + MongoDB models) and a React + Vite frontend.

**Contents**
- **Project:** Overview and features
- **Tech Stack:** Libraries and runtimes used
- **Repository Layout:** Major folders and files
- **Getting Started:** Instructions to run backend and frontend locally
- **Environment:** Required environment variables and secure notes
- **Database:** How to seed the database for development
- **API:** Main endpoints and authentication
- **Contributing & License**

**Project Overview**
- **Purpose:** Provide a small, focused platform for taking quizzes across technologies (HTML, CSS, JavaScript, Python, etc.) and recording user results.
- **Key features:** User registration & login, authenticated quiz result submission, result listing, seeded sample quizzes and users for development.

**Tech Stack**
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React (Vite)
- **Auth:** JSON Web Tokens (JWT)
- **Other:** bcryptjs for password hashing, dotenv for env management, cors, validator

**Repository Layout**
- `backend/` — Express API, models, controllers, routes, DB config and seed data
	- `server.js` — entry point for backend
	- `config/db.js` — MongoDB connection helper
	- `config/seed.mjs` — script to populate sample users, quizzes and results
	- `routes/` — `userRoutes.js`, `resultRoutes.js`
	- `controller/` — `userController.js`, `resultController.js`
	- `models/` — `userModel.js`, `quizModel.js`, `resultModel.js`
- `Frontend/` — React + Vite app
	- `src/` — React components and pages

**Getting Started (Development)**
Prerequisites:
- Node.js (recommended v16+)
- npm (or yarn)

1) Backend

Open a terminal, then:

```powershell
cd backend
npm install
# Start dev server with nodemon
npm run dev
```

The backend listens on port `4000` by default (`server.js`).

2) Frontend

Open a second terminal, then:

```powershell
cd Frontend
npm install
npm run dev
```

Vite's dev server will start (default port shown in terminal). The frontend calls the backend API under `/api` paths (CORS enabled on backend).

**Scripts**
- Backend (from `backend/package.json`):
	- `npm run dev` — start dev server with `nodemon server.js`
	- `npm start` — start production server with `node server.js`
- Frontend (from `Frontend/package.json`):
	- `npm run dev` — start Vite dev server
	- `npm run build` — build production assets
	- `npm run preview` — preview production build

**Environment / Configuration**
The project currently includes a hardcoded MongoDB connection in `backend/config/db.js` and placeholder JWT constants in `backend/config/constants.js`. For security and deployment you should move secrets to environment variables.

Recommended `.env` entries (create `backend/.env`):

```
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/MindMatrics
JWT_SECRET=your_strong_jwt_secret_here
PORT=4000
```

Then update `config/db.js` to use `process.env.MONGODB_URI` (or set `MONGODB_URI` in your environment). The backend already imports `dotenv` in `server.js`.

**Database Seeding (Development)**
To populate the DB with sample users, quizzes and results (useful for local testing), run the seed script from the `backend` folder:

```powershell
cd backend
node config/seed.mjs
```

The seed script connects to the same MongoDB used by the app. Ensure the `MONGODB_URI` or hardcoded connection is accessible from your environment.

**API (Main Endpoints)**
All API routes are prefixed in `server.js`:

- Auth (no auth required):
	- `POST /api/auth/register` — Register a new user. Body: `{ name, email, password }`.
	- `POST /api/auth/login` — Login existing user. Body: `{ email, password }`. Response includes a JWT token.
- Results (authentication required — send `Authorization: Bearer <token>`):
	- `POST /api/results` — Create/submit a quiz result. Body includes `quizId`, `correctAnswers` (and optionally `wrongAnswers`).
	- `GET /api/results` — List results for authenticated user. Query params: `technology`, `level` (optional).

Authentication: send header `Authorization: Bearer <token>` where `<token>` is the JWT returned by login/register.

Example curl (login):

```bash
curl -X POST http://localhost:4000/api/auth/login \
	-H "Content-Type: application/json" \
	-d '{"email":"user1@example.com","password":"password123"}'
```

**Notes & TODOs**
- The current `backend/config/db.js` contains a hardcoded connection string — replace it with `process.env.MONGODB_URI` before publishing.
- `backend/config/constants.js` exports placeholder JWT constants; prefer using `process.env.JWT_SECRET`.
- Some controller and model code has minor bugs/typos (e.g., references to undefined variables in `resultController.js`). If you want, I can audit and patch those.

**Contributing**
- To contribute: fork the repo, create a feature branch, and open a pull request. Add unit tests or manual verification steps for backend changes when possible.

**License & Contact**
- Include your preferred license file if desired (e.g., `MIT`).
- For questions contact the project owner or maintainers.

---

If you'd like, I can also:
- Add a `.env.example` file with recommended variables
- Add a `seed` script to `backend/package.json` (e.g., `"seed": "node config/seed.mjs"`)
- Fix the hardcoded DB/JWT usage to read from `process.env` and update controllers with more robust error handling

Tell me which of these you'd like me to implement next.
