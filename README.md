# 🚀 JobPilot — AI-Powered Job Search Platform

JobPilot is a modern, high-performance web application designed to automate and optimize the job search process. By combining real-time web scraping with advanced AI analysis, JobPilot helps job seekers find the right roles, understand their match potential, and track their applications with ease.

---

## ✨ Key Features

### 🔍 Multi-Platform Job Scraping
Never jump between multiple tabs again. JobPilot aggregates job listings from:
- **LinkedIn**, **Naukri**, **Internshala**, **Indeed**, **Wellfound**, and **Shine**.
- Real-time scraping ensures you see the latest opportunities as they appear.

### 🤖 AI Resume Parsing & Analysis
- **Resume Parsing:** Upload your PDF resume, and our AI (powered by Claude 3.7) automatically extracts your skills and professional summary.
- **Match Scoring:** Every job listing is analyzed against your specific profile, giving you a percentage match score and detailed reasoning on why you're a good fit.

### 📋 Application Tracker
- Manage your entire pipeline in one place with a beautiful Kanban-style board.
- Track statuses from **Applied** → **Interview** → **Offer** → **Rejected**.
- Automatic tracking: Clicking 'Apply' on a job card automatically adds it to your tracker.

### 👤 Profile Management
- Customize your professional summary, top skills, and links (LinkedIn, GitHub, Portfolio).
- Everything is kept in sync with the AI matching engine to improve your scores.

---

## 🛠️ Technology Stack

### **Frontend**
- **Core:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** Zustand
- **Animations:** Framer Motion
- **Icons:** Lucide React

### **Backend**
- **Server:** Node.js + Express
- **Database:** PostgreSQL (hosted on Neon)
- **ORM:** Prisma
- **AI Engine:** Anthropic (Claude 3.7 SDK)
- **Scraper:** Puppeteer (with Stealth Plugin)
- **Authentication:** JWT (JSON Web Tokens)
- **File Handling:** Multer + PDF-Parse

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A PostgreSQL database (or Neon.tech account)
- Anthropic API Key (for AI features)

### 1. Clone & Install
```bash
git clone https://github.com/Garrur/JOBPILOT.git
cd JobPilot

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### 2. Environment Setup
Create a `.env` file in the **server** directory:
```env
DATABASE_URL="your_postgresql_url"
JWT_SECRET="your_jwt_secret"
CLAUDE_API_KEY="your_anthropic_api_key"
PORT=5000
```

Create a `.env` file in the **client** directory:
```env
VITE_API_URL="http://localhost:5000/api"
```

### 3. Database Migration
```bash
cd server
npx prisma db push
npx prisma generate
```

### 4. Run Locally
Open two terminal windows:

**Terminal 1 (Server):**
```bash
cd server
npm run dev
```

**Terminal 2 (Client):**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to get started!

---

## 🏗️ Project Structure
```text
JobPilot/
├── client/           # React frontend
│   ├── src/
│   │   ├── components/  # UI & Layout components
│   │   ├── pages/       # Page views (Dashboard, Jobs, Profile)
│   │   ├── store/       # Zustand state stores
│   │   └── lib/         # API & Helper utilities
├── server/           # Express backend
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API Route definitions
│   │   ├── services/    # Business logic (AI, Scraper)
│   │   └── middleware/  # Auth & Upload middleware
│   └── prisma/       # Database schema
└── README.md
```

---

## 👨‍💻 Contributing
Found a bug or have a feature request? Feel free to open an issue or submit a pull request!

Built with ❤️ by the JobPilot Team.
