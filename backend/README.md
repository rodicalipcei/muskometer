# Muskometer Backend

This is the backend for the Muskometer application, a platform that allows users to rate Elon Musk's statements and actions on a scale from 0 to 10.

## Features

- REST API for ratings and quotes
- SQLite database for data storage
- Historical rating tracking
- Daily quote management

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd muskometer-backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory (you can copy from `.env.example`):
   ```
   # Server configuration
   PORT=3001
   NODE_ENV=development

   # Database configuration
   DB_PATH=./muskometer.db

   # CORS configuration (frontend URL)
   FRONTEND_URL=http://localhost:3000

   # API Rate Limiting
   RATE_LIMIT_WINDOW=15m
   RATE_LIMIT_MAX=100
   ```

## Running the Application

### Development Mode

```
npm run dev
```

This will start the server with nodemon, which will automatically restart the server when you make changes.

### Production Mode

```
npm start
```

## API Endpoints

### Quotes

- `GET /api/quotes/today`: Get the quote of the day

### Ratings

- `GET /api/ratings/current`: Get current rating statistics
  - Query parameters:
    - `timeRange`: Number of days to include (default: 30)

- `POST /api/ratings`: Submit a new rating
  - Request body:
    - `rating`: Number between 0 and 10

- `GET /api/ratings/history`: Get historical rating data
  - Query parameters:
    - `period`: Time period ('1month', '3months', '6months', '1year', 'all')

## Database

The application uses SQLite for data storage. The database file is created automatically when the application starts and is located at the path specified in the `.env` file (`DB_PATH`).

### Tables

- `ratings`: Stores user ratings
  - `id`: Auto-incrementing primary key
  - `rating`: User rating (0-10)
  - `timestamp`: Date and time of the rating

- `quotes`: Stores daily quotes
  - `id`: Auto-incrementing primary key
  - `text`: Quote text
  - `date`: Quote date

## Frontend Configuration

To connect the frontend to this backend, update the `.env` file in your frontend project:

```
VITE_API_URL=http://localhost:3001/api
```

## License

[MIT](LICENSE)