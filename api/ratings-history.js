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
    
    const period = req.query.period || '1month';
    let days = 30;

    switch (period) {
      case '3months': days = 90; break;
      case '6months': days = 180; break;
      case '1year': days = 365; break;
      case 'all': days = 9999; break;
    }

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    // MongoDB aggregation pipeline to get average rating by date
    const aggregationPipeline = [
      {
        $match: {
          timestamp: { $gte: cutoffDate }
        }
      },
      {
        $project: {
          rating: 1,
          // Create a date string in YYYY-MM-DD format for grouping
          dateString: {
            $dateToString: { format: "%Y-%m-%d", date: "$timestamp" }
          }
        }
      },
      {
        $group: {
          _id: "$dateString",
          rating: { $avg: "$rating" }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ];
    
    const results = await ratings.aggregate(aggregationPipeline).toArray();
    
    // Format results to match the expected output
    const formattedResults = results.map(item => ({
      date: item._id,
      rating: parseFloat(item.rating.toFixed(1))
    }));
    
    res.status(200).json(formattedResults);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Database error', details: error.message });
  } finally {
    await client.close();
  }
};