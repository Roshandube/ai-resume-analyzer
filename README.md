# AI Resume Analyzer

A full-stack AI-powered resume analysis application that evaluates resume quality, provides an ATS-readiness score, and compares resumes against job descriptions using Google Gemini AI.

## Features

- User registration and login
- JWT-based authentication
- Protected routes
- PDF resume upload
- Resume text extraction
- AI-powered resume analysis
- ATS-readiness scoring
- Job-description matching
- Job match score
- Strength and weakness analysis
- Matched skills identification
- Missing skills identification
- Resume improvement suggestions
- Recommended job roles
- Resume analysis history
- Delete uploaded resumes

## ATS Readiness vs Job Match

### ATS Readiness Score

The ATS Readiness Score evaluates the general quality and ATS-friendliness of the resume based on factors such as:

- Skills and keyword clarity
- Experience and project quality
- Measurable achievements
- Resume structure
- Professional language

It does not represent the score assigned by a specific employer's ATS.

### Job Match Score

When a job description is provided, the application compares the resume against the supplied requirements.

It considers:

- Required skills
- Technologies
- Experience requirements
- Responsibilities
- Qualifications
- Relevant keywords

The score is an AI-generated estimate of resume-to-job-description alignment and is not an employer selection guarantee.

## Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Context API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Multer

### AI

- Google Gemini API

## Application Flow

User
→ Register/Login
→ JWT Authentication
→ Upload Resume
→ PDF Text Extraction
→ Gemini AI Analysis
→ MongoDB
→ React Dashboard
→ Resume Analysis

For job matching:

Resume + Job Description
→ Gemini AI
→ Job Match Score
→ Matched Skills
→ Missing Skills
→ Suggestions

## Project Structure

    ai-resume-analyzer/
    │
    ├── backend/
    │   ├── config/
    │   ├── controllers/
    │   ├── middleware/
    │   ├── models/
    │   ├── routes/
    │   ├── services/
    │   └── server.js
    │
    └── frontend/
        └── src/
            ├── components/
            ├── context/
            ├── pages/
            ├── services/
            ├── App.jsx
            └── main.jsx

## Environment Variables

Create a `.env` file inside the backend directory.

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    GEMINI_API_KEY=your_gemini_api_key

Never commit your real `.env` file or API keys.

## Run Locally

Clone the repository.

    git clone https://github.com/Roshandube/ai-resume-analyzer.git

### Backend

    cd backend
    npm install
    npm run dev

### Frontend

Open another terminal:

    cd frontend
    npm install
    npm run dev

## Main API Endpoints

### Authentication

    POST /api/auth/register
    POST /api/auth/login

### Resume

    POST   /api/resume/upload
    GET    /api/resume
    DELETE /api/resume/:id

### AI Analysis

    POST /api/ai/analyze/:resumeId
    GET  /api/ai/analysis/:resumeId

## Future Improvements

- Resume-to-JD keyword visualization
- Multiple resume comparison
- Resume improvement assistant
- Exportable analysis report
- More detailed scoring breakdown

## Disclaimer

ATS Readiness and Job Match scores are AI-generated evaluations intended to provide resume improvement guidance. Actual applicant tracking systems and employer screening processes vary.
