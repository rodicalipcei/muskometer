# Muskometer App

A web application to track public opinion on Elon Musk's statements and actions over time.

## Project Overview

Muskometer is a Vue 3 application that allows users to:
- View a quote of the day from Elon Musk
- Rate Elon Musk on a scale from 0 to 10
- View the average rating and total number of votes
- Explore historical rating data through interactive charts

## Tech Stack

### Frontend
- Vue 3
- TypeScript
- Vite
- Vue Router
- Chart.js

### Backend
- Node.js
- Express.js

### Deployment
- Vercel

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Git

### Installation

#### Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/muskometer.git
cd muskometer
```

#### Install frontend dependencies
```bash
npm install
```

#### Install backend dependencies
```bash
cd backend
npm install
cd ..
```

### Development

#### Start the frontend development server
```bash
npm run dev
```

#### Start the backend development server
```bash
cd backend
npm run dev
```

### Building for Production

#### Build the frontend
```bash
npm run build
```

## Project Structure

```
muskometer/
├── public/                  # Public static files
├── src/                     # Frontend source code
│   ├── assets/              # Assets (images, fonts, etc.)
│   ├── components/          # Vue components
│   │   ├── charts/          # Chart components
│   │   ├── common/          # Common UI components
│   │   ├── polls/           # Poll-related components
│   │   └── quotes/          # Quote-related components
│   ├── router/              # Vue Router configuration
│   ├── services/            # API services
│   ├── store/               # State management
│   ├── styles/              # Global styles
│   ├── types/               # TypeScript type definitions
│   ├── views/               # Page components
│   ├── App.vue              # Root component
│   └── main.ts              # Entry point
├── backend/                 # Backend source code
│   ├── server.js            # Express server
│   └── package.json         # Backend dependencies
├── .env                     # Environment variables
├── .gitignore               # Git ignore file
├── index.html               # HTML entry point
├── package.json             # Frontend dependencies
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # Project documentation
```

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Log in to Vercel and import your GitHub repository
3. Configure the build settings:
   - Frontend:
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Backend:
     - Build Command: `cd backend && npm install`
     - Output Directory: `backend`

## Next Steps

Future enhancements for the Muskometer app:
1. User authentication to prevent multiple votes
2. More detailed analytics
3. Historical quotes archive
4. Comment section for each quote
5. Social sharing features

## License

This project is licensed under the MIT License.