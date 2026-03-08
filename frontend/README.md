# Medical Management System - Frontend

A minimalistic React frontend for the medical management backend.

## Features

- User registration and management
- Hospital bed management and booking (CCU/ICU/General)
- Ambulance management and booking
- Doctor registration
- AI-powered medical image analysis

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Backend Configuration

The frontend expects the backend API to be running on `http://localhost:8000`. The Vite proxy configuration automatically routes `/api/*` requests to the backend.

## Running the Application

1. Start the backend server (from the backend folder):
```bash
cd backend
fastapi dev main.py
```

2. Start the frontend (from the frontend folder):
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:3000`
