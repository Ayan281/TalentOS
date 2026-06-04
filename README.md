

# 🚀 TalentOS
![React](https://img.shields.io/badge/React-19-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-black)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-blue)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-black)
![Render](https://img.shields.io/badge/Backend-Render-blue)

<div align="center">

### AI-Powered Talent Intelligence & Career Discovery Platform

Transforming resumes into actionable career intelligence while helping recruiters discover, evaluate, and connect with top talent.

[Live Demo](https://talent-os-kappa.vercel.app/) • [Backend API](#) • [Report Bug](../../issues)

</div>

---

## 📌 Overview

TalentOS is a full-stack Talent Intelligence Platform designed to bridge the gap between students and recruiters.

The platform transforms traditional resumes into structured career profiles through automated resume parsing, skill extraction, candidate intelligence, and recruiter-focused talent discovery tools.

Unlike conventional job portals, TalentOS focuses on helping recruiters identify high-potential candidates while empowering students with career insights and professional networking capabilities.

---

## 🎯 The Problem

Recruiters often spend significant time manually reviewing resumes and identifying qualified candidates.

Students struggle to:

- Understand their career readiness
- Showcase their skills effectively
- Connect directly with recruiters
- Discover opportunities aligned with their profiles

---

## 💡 The Solution

TalentOS provides:

### For Students

✅ Resume Intelligence

✅ Automated Skill Extraction

✅ Career Profile Generation

✅ Job-Fit Analysis

✅ Real-Time Recruiter Communication

---

### For Recruiters

✅ Talent Discovery Engine

✅ Candidate Ranking System

✅ Resume Repository

✅ Match Percentage Analytics

✅ Direct Candidate Communication

---

## ✨ Core Features

### 🔐 Secure Authentication System

- JWT Authentication
- HTTP-Only Cookie Storage
- Role-Based Authorization
- Protected Routes
- Secure Session Management

---

### 📄 Resume Intelligence Engine

Upload resumes and automatically generate structured candidate profiles.

Features:

- PDF Resume Upload
- Cloudinary Storage
- PDF Text Extraction
- Resume Parsing
- Automatic Skill Detection
- Candidate Profile Generation

---

### 🧠 Skill Extraction System

TalentOS automatically extracts technical skills from uploaded resumes.

Examples:

- JavaScript
- React
- Node.js
- MongoDB
- Docker
- AWS
- Python
- Machine Learning
- And many more...

---

### 🎯 Candidate Intelligence

Generate detailed candidate profiles containing:

- Experience Level
- Technical Skills
- Soft Skills
- Career Interests
- Resume Analytics

---

### 📊 Recruiter Intelligence Suite

Recruiters can:

- View candidate profiles
- Access resumes
- Analyze match percentages
- Discover top candidates
- Rank applicants based on compatibility

---

### 🏆 Talent Leaderboard

A recruiter-focused ranking system that highlights top-performing candidates based on job-fit analysis.

Features:

- Candidate Ranking
- Match Percentage Tracking
- Recruiter Visibility
- Talent Discovery

---

### 💬 Real-Time Messaging

Built using Socket.IO.

Features:

- One-to-One Messaging
- Real-Time Delivery
- Typing Indicators
- Conversation History
- Read Receipts
- Persistent Chat Storage
- Secure Socket Authentication

---

## ⚙️ System Architecture

```text
                    ┌────────────────────┐
                    │      Frontend      │
                    │       React        │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │    Express API     │
                    └─────────┬──────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼

 ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
 │ Authentication │  │ Resume Engine  │  │ Chat Engine    │
 │ JWT + Cookies  │  │ PDF Parsing    │  │ Socket.IO      │
 └────────────────┘  └────────────────┘  └────────────────┘
          │                   │                   │
          └───────────────────┼───────────────────┘
                              ▼

                    ┌────────────────────┐
                    │     MongoDB Atlas  │
                    └────────────────────┘

                              │
                              ▼

                    ┌────────────────────┐
                    │     Cloudinary     │
                    │ Resume Storage     │
                    └────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router
- Axios
- Context API
- Tailwind CSS
- Socket.IO Client

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Cloudinary
- PDF-Parse
- Socket.IO

### Database

- MongoDB Atlas

### Deployment

- Vercel
- Render

---

## 🚀 Resume Processing Pipeline

```text
Resume Upload
      │
      ▼
Cloudinary Storage
      │
      ▼
PDF Parsing
      │
      ▼
Text Extraction
      │
      ▼
Skill Extraction Engine
      │
      ▼
Candidate Profile Creation
      │
      ▼
Recruiter Visibility
```

---

## ⚡ Real-Time Communication Pipeline

```text
Student
   │
   ▼
Socket.IO Client
   │
   ▼
Socket.IO Server
   │
   ▼
MongoDB Persistence
   │
   ▼
Recruiter
```

---

## 🔒 Security Features

- Password Hashing with Bcrypt
- JWT Authentication
- HTTP-Only Cookies
- Protected API Routes
- Role-Based Access Control
- Socket Authentication Middleware
- Secure Session Management

---

## 📈 Key Engineering Concepts Demonstrated

- RESTful API Design
- Authentication & Authorization
- Real-Time Systems
- WebSocket Communication
- Resume Parsing
- File Upload Handling
- Cloud Storage Integration
- Database Modeling
- Role-Based Access Control
- Production Deployment
- State Management
- Scalable Backend Architecture

---

## 🌍 Live Deployment

### Frontend

https://talent-os-kappa.vercel.app/

### Backend

Deployed on Render

---

## 📚 Future Roadmap

- Google OAuth
- GitHub OAuth
- AI Resume Scoring
- ATS Compatibility Analysis
- Skill Gap Detection
- Career Roadmap Generator
- Recruiter Dashboard
- AI Career Mentor
- Advanced Candidate Analytics

---

## 👨‍💻 Developer

### Ayan Azmi

B.Tech Computer Science Student | Full Stack Developer

Passionate about building scalable software products that solve real-world problems through intelligent systems, modern web technologies, and user-centric design.

### Core Interests

- Full Stack Development
- Backend Engineering
- System Design
- Cloud Technologies
- Real-Time Applications
- AI-Powered Products

---

## ⭐ Support

If you found this project interesting, consider giving it a star.

It helps the project reach more developers and recruiters.

⭐ Star TalentOS
