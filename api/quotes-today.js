import { MongoClient } from 'mongodb';

// MongoDB connection string - store this in Vercel environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'muskometer';

// Add logging to help diagnose issues
console.log('quotes-today.js - API handler initialized');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_DB_NAME:', process.env.MONGODB_DB_NAME || 'using default (muskometer)');

export default async function handler(req, res) {
  console.log('quotes-today.js - Request received:', req.method, req.url);
  
  // Handle CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    console.log('quotes-today.js - Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    console.log('quotes-today.js - Connecting to MongoDB...');
    await client.connect();
    console.log('quotes-today.js - Connected to MongoDB successfully');
    
    const database = client.db(dbName);
    console.log('quotes-today.js - Accessing database:', dbName);
    
    const quotes = database.collection('quotes');
    console.log('quotes-today.js - Accessing collection: quotes');
    
    // Find the most recent quote
    console.log('quotes-today.js - Querying for latest quote');
    const latestQuote = await quotes.findOne(
      {}, // empty filter to match all documents
      { sort: { _id: -1 } } // sort by _id descending (assuming _id has a timestamp component)
    );
    
    if (!latestQuote) {
      console.log('quotes-today.js - No quotes found in collection');
      res.status(404).json({ error: 'No quotes found' });
      return;
    }
    
    console.log('quotes-today.js - Quote found, returning response');
    res.status(200).json(latestQuote);
  } catch (error) {
    console.error('quotes-today.js - Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    console.log('quotes-today.js - Closing MongoDB connection');
    await client.close();
  }
};