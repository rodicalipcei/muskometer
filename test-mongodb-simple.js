// ES Module version
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

console.log('Script started');
console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);

if (!process.env.MONGODB_URI) {
  console.error('ERROR: No MONGODB_URI found in .env file');
  process.exit(1);
}

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  console.log('Creating MongoDB client...');
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('Connected successfully!');
    return 'Success';
  } catch (error) {
    console.error('Connection failed with error:', error.name);
    console.error('Error message:', error.message);
    return 'Failed';
  } finally {
    await client.close();
    console.log('Connection closed');
  }
}

// Run the test
testConnection()
  .then(result => console.log('Final result:', result))
  .catch(err => console.error('Unexpected error:', err))
  .finally(() => console.log('Test completed'));