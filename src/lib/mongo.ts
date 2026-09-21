import { MongoClient } from 'mongodb';

const globalWithMongo = globalThis as typeof globalThis & {
  __mongoClientPromise?: Promise<MongoClient>;
};

let clientPromise: Promise<MongoClient> | undefined;

export async function getMongoClient(): Promise<MongoClient> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured');
  }

  if (!globalWithMongo.__mongoClientPromise) {
    const client = new MongoClient(mongoUri);
    globalWithMongo.__mongoClientPromise = client.connect();
  }

  clientPromise = globalWithMongo.__mongoClientPromise;
  return clientPromise;
}

export async function getMenuCollection() {
  const client = await getMongoClient();
  return client.db().collection('menu_state');
}
