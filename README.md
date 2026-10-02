# AptitudeX — Full-Stack Placement & Reasoning Practice Platform

AptitudeX is a full-stack web application designed for campus placement and competitive exam preparation. It features a Node.js + Express REST API backend, dynamic question seed database (1,000+ curated questions), JWT authentication, user progress analytics, automated mock test evaluation, global leaderboards, admin question management, particle visual effects, and creature gamification.

---

## 🚀 Features

- **Express REST API Backend**: Full RESTful APIs for authentication, questions catalog, search & filter, user progress, mock tests, and leaderboards.
- **1,000+ Curated Questions**: Pre-seeded with questions covering Quantitative Aptitude, Logical Reasoning, and Verbal Ability across major MNC placement patterns (TCS, Infosys, Wipro, Amazon, Microsoft, etc.).
- **Authentication & Security**: JWT token authentication with bcrypt password & recovery phrase hashing. Automatic first-user admin assignment.
- **Interactive Mock Tests**: Custom mock test generator with automated scoring, time limits, detailed breakdown, and topic recommendations.
- **Real-Time Analytics & Streak Tracking**: Topic-wise accuracy, strong/weak topic detection, 7-day activity graphs, and streak counters.
- **Gamification & VFX**: Stardust canvas particle engine, creature summoning mechanics upon answering, level-up mana tracking, and dark/light themes.
- **Admin Management Portal**: CRUD interface for questions, bulk JSON import/export, user attempt overview, and scoring configuration.
- **GitHub & Cloud Deployment Ready**: Includes GitHub Actions CI/CD pipeline (`.github/workflows/deploy.yml`), Dockerfile, and cloud deployment configuration.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js, JWT (`jsonwebtoken`), Bcrypt (`bcryptjs`), CORS
- **Database**: Embedded JSON/SQLite database storage (`db.js`) with zero binary build dependencies
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Vanilla CSS3 (Custom Design System with Glassmorphism & Animations), HTML5 Canvas Particles Engine
- **DevOps**: Docker, Docker Compose, GitHub Actions CI/CD

---

## 📡 REST API Reference

| Endpoint | Method | Description | Auth Required |
|----------|--------|-------------|---------------|
| `/api/auth/signup` | `POST` | Register a new user account | No |
| `/api/auth/login` | `POST` | Login user & retrieve JWT token | No |
| `/api/auth/forgot` | `POST` | Reset password using recovery phrase | No |
| `/api/auth/me` | `GET` | Get current user profile | Yes |
| `/api/questions` | `GET` | Filter, search, and paginate questions | No |
| `/api/questions/catalog` | `GET` | Get category & topic taxonomy | No |
| `/api/questions/:id` | `GET` | Get single question by ID | No |
| `/api/questions` | `POST` | Add a new question | Admin |
| `/api/questions/:id` | `PUT` | Edit question | Admin |
| `/api/questions/:id` | `DELETE` | Delete question | Admin |
| `/api/questions/import` | `POST` | Bulk import array of JSON questions | Admin |
| `/api/user/progress` | `GET` | Get user attempts, bookmarks, & streak | Yes / Guest |
| `/api/user/attempt` | `POST` | Record a question attempt | Yes / Guest |
| `/api/user/bookmark` | `POST` | Toggle question bookmark | Yes / Guest |
| `/api/user/report` | `POST` | Report a question issue | Yes / Guest |
| `/api/mocks/generate` | `POST` | Generate randomized mock test | No |
| `/api/mocks/submit` | `POST` | Evaluate and save mock test submission | Yes / Guest |
| `/api/mocks/history` | `GET` | Get mock test history | Yes / Guest |
| `/api/leaderboard` | `GET` | Get global leaderboard rankings | No |
| `/api/config/scoring` | `GET/POST` | Get or update marking system | Admin |

---

## 💻 Local Quickstart

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- `git`

### Installation & Run

1. Clone or navigate to the repository:
   ```bash
   cd aptitudex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Seed the 1,000+ questions database:
   ```bash
   npm run seed
   ```

4. Start the Express backend server:
   ```bash
   npm start
   ```

5. Open your browser and visit:
   `http://localhost:5000`

---

## 🐙 How to Push & Deploy on GitHub

### 1. Initialize Git and Commit Code

Open PowerShell or Command Prompt in the `aptitudex` directory:

```bash
git init
git add .
git commit -m "Initial commit: Add Express backend, API endpoints, database seeding, and deployment scripts"
```

### 2. Create GitHub Repository & Push

1. Go to [GitHub New Repository](https://github.com/new).
2. Name your repository `aptitudex` (or preferred name).
3. Do NOT check "Initialize with README".
4. Copy the repository URL (e.g. `https://github.com/your-username/aptitudex.git`).
5. Run the following commands in your terminal:

```bash
git remote add origin https://github.com/YOUR-USERNAME/aptitudex.git
git branch -M main
git push -u origin main
```

---

## ☁️ 1-Click Cloud Deployment Guides

### Option A: Render (Free Web Service)
1. Go to [Render Dashboard](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository `aptitudex`.
3. Set the following details:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run seed`
   - **Start Command**: `npm start`
4. Click **Create Web Service**. Your live backend URL will be generated instantly (e.g., `https://aptitudex.onrender.com`).

### Option B: Railway / Koyeb / Fly.io (Docker Deployment)
1. Connect your GitHub repo to Railway or Koyeb.
2. The platform automatically detects the `Dockerfile` and deploys the Node.js Express server.

### Option C: Vercel / Netlify
1. Import the repository into Vercel.
2. Vercel automatically deploys static assets and serverless route functions.

---

## 📜 License
This project is open-source under the [MIT License](LICENSE).
