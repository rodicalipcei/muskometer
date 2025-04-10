const { MongoClient } = require('mongodb');

// MongoDB connection string - store this in Vercel environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'muskometer';

module.exports = async (req, res) => {
  // Handle CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    const quotes = database.collection('quotes');
    
    // Find the most recent quote
    // Note: In MongoDB you would typically use a timestamp or date field to sort
    const latestQuote = await quotes.findOne(
      {}, // empty filter to match all documents
      { sort: { _id: -1 } } // sort by _id descending (assuming _id has a timestamp component)
    );
    
    if (!latestQuote) {
      res.status(404).json({ error: 'No quotes found' });
      return;
    }
    
    res.status(200).json(latestQuote);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    await client.close();
  }
};