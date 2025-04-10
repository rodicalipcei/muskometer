const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Configure port
const PORT = process.env.PORT || 3001;

// Database file path
const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'muskometer.db');

// Initialize database
const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  // Create ratings table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS ratings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      rating INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Create quotes table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS quotes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
  
  // Insert a sample quote if the quotes table is empty
  db.get('SELECT COUNT(*) as count FROM quotes', (err, result) => {
    if (err) {
      console.error('Error checking quotes table:', err.message);
      return;
    }
    
    if (result.count === 0) {
      const sampleQuote = {
        text: "I have not personally committed violence, nor have I ever advocated that others engage in violence, yet the left has firebombed and shot bullets into my stores and many have advocated for my death.\n\nThey are guilty of that which they accuse me.",
        date: new Date().toISOString().split('T')[0]
      };
      
      db.run('INSERT INTO quotes (text, date) VALUES (?, ?)', 
        [sampleQuote.text, sampleQuote.date], 
        function(err) {
          if (err) {
            console.error('Error inserting sample quote:', err.message);
          } else {
            console.log('Sample quote inserted with ID:', this.lastID);
          }
        }
      );
    }
  });
}

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(bodyParser.json());

// API Routes

// Get quote of the day
app.get('/api/quotes/today', (req, res) => {
  db.get('SELECT * FROM quotes ORDER BY id DESC LIMIT 1', (err, row) => {
    if (err) {
      console.error('Error fetching quote:', err.message);
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (!row) {
      return res.status(404).json({ error: 'No quotes found' });
    }
    
    res.json(row);
  });
});

// Get current rating statistics
app.get('/api/ratings/current', (req, res) => {
  // Get average rating and total votes
  const timeRange = req.query.timeRange || '30'; // Default to 30 days
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - parseInt(timeRange));
  const timestampStr = timestamp.toISOString();
  
  db.get(
    `SELECT 
      AVG(rating) as averageRating, 
      COUNT(*) as totalVotes 
    FROM ratings 
    WHERE timestamp >= ?`,
    [timestampStr],
    (err, row) => {
      if (err) {
        console.error('Error fetching ratings:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        averageRating: row.averageRating || 5.0, // Default to 5.0 if no ratings
        totalVotes: row.totalVotes || 0
      });
    }
  );
});

// Submit a new rating
app.post('/api/ratings', (req, res) => {
  const { rating } = req.body;
  
  // Validate rating
  if (typeof rating !== 'number' || rating < 0 || rating > 10) {
    return res.status(400).json({ error: 'Invalid rating. Must be a number between 0 and 10.' });
  }
  
  // Insert rating into the database
  db.run(
    'INSERT INTO ratings (rating) VALUES (?)',
    [rating],
    function(err) {
      if (err) {
        console.error('Error inserting rating:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // After inserting, get the updated stats
      const timeRange = req.query.timeRange || '30'; // Default to 30 days
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - parseInt(timeRange));
      const timestampStr = timestamp.toISOString();
      
      db.get(
        `SELECT 
          AVG(rating) as averageRating, 
          COUNT(*) as totalVotes 
        FROM ratings 
        WHERE timestamp >= ?`,
        [timestampStr],
        (err, row) => {
          if (err) {
            console.error('Error fetching updated ratings:', err.message);
            return res.status(500).json({ error: 'Database error' });
          }
          
          res.json({
            averageRating: row.averageRating || 5.0,
            totalVotes: row.totalVotes || 0
          });
        }
      );
    }
  );
});

// Get historical ratings
app.get('/api/ratings/history', (req, res) => {
  const period = req.query.period || '1month';
  let days = 30;
  
  switch (period) {
    case '3months':
      days = 90;
      break;
    case '6months':
      days = 180;
      break;
    case '1year':
      days = 365;
      break;
    case 'all':
      days = 9999; // Essentially all data
      break;
  }
  
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() - days);
  const timestampStr = timestamp.toISOString();
  
  // Query to get average rating per day
  db.all(
    `SELECT 
      date(timestamp) as date, 
      AVG(rating) as rating 
    FROM ratings 
    WHERE timestamp >= ? 
    GROUP BY date(timestamp)
    ORDER BY date(timestamp)`,
    [timestampStr],
    (err, rows) => {
      if (err) {
        console.error('Error fetching historical ratings:', err.message);
        return res.status(500).json({ error: 'Database error' });
      }
      
      // Format the results
      const results = rows.map(row => ({
        date: row.date,
        rating: parseFloat(row.rating.toFixed(1))
      }));
      
      res.json(results);
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});