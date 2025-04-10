const { MongoClient } = require('mongodb');

// MongoDB connection string - store this in Vercel environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'muskometer';

module.exports = async (req, res) => {
  // Handle CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Parse request body - handle both raw and parsed body formats
  let body = req.body;
  
  // Handle case where body might be a raw string (common in serverless functions)
  if (typeof req.body === 'string') {
    try {
      body = JSON.parse(req.body);
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON in request body' });
      return;
    }
  } 
  // Handle case where body might not be available directly
  else if (!req.body) {
    let rawBody = '';
    req.on('data', chunk => rawBody += chunk);
    
    // Wait for the body to be fully received
    await new Promise(resolve => {
      req.on('end', () => {
        try {
          body = JSON.parse(rawBody);
          resolve();
        } catch (error) {
          res.status(400).json({ error: 'Invalid JSON in request body' });
          req.destroy();
        }
      });
    });
  }

  // Check if rating is valid
  const { rating } = body;
  if (typeof rating !== 'number' || rating < 0 || rating > 10) {
    res.status(400).json({ error: 'Invalid rating. Must be between 0 and 10.' });
    return;
  }

  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const database = client.db(dbName);
    const ratingsCollection = database.collection('ratings');
    
    // Insert the new rating with current timestamp
    const newRating = {
      rating: rating,
      timestamp: new Date()
    };
    
    await ratingsCollection.insertOne(newRating);
    
    // Calculate average rating based on timeRange
    const timeRange = req.query.timeRange || '30';
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
    
    // Use aggregation pipeline to calculate average
    const aggregationResult = await ratingsCollection.aggregate([
      { 
        $match: { 
          timestamp: { $gte: cutoffDate } 
        } 
      },
      { 
        $group: { 
          _id: null, 
          averageRating: { $avg: '$rating' },
          totalVotes: { $sum: 1 }
        } 
      }
    ]).toArray();
    
    // If no ratings found, return default values
    const stats = aggregationResult[0] || { averageRating: 5.0, totalVotes: 0 };
    
    res.status(200).json({
      averageRating: parseFloat((stats.averageRating || 5.0).toFixed(1)),
      totalVotes: stats.totalVotes || 0
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    await client.close();
  }
};