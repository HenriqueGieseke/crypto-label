import { MongoClient } from 'mongodb';

const mongodbConnect = async () => {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = await client.db('scrapers');
};

export default mongodbConnect;
