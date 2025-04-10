import { MongoClient } from 'mongodb';

// MongoDB connection string - store this in Vercel environment variables
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'muskometer';

export default async function handler (req, res) {
  // Handle CORS for local development
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
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
    const ratings = database.collection('ratings');
    
    const timeRange = req.query.timeRange || '30';
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(timeRange));
    
    // Use MongoDB aggregation to calculate average
    const aggregationPipeline = [
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
    ];
    
    const result = await ratings.aggregate(aggregationPipeline).toArray();
    const stats = result[0] || { averageRating: 5.0, totalVotes: 0 };
    
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