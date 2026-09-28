import { Collection, Db, MongoClient } from 'mongodb';
import { MenuStateDocument } from '@/types/menu';

const globalForMongo = globalThis as typeof globalThis & {
  mongoClientPromise?: Promise<MongoClient>;
};

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error('MONGODB_URI is not configured');
  }
  return uri;
}

export async function getMongoDatabase(): Promise<Db> {
  const uri = getMongoUri();
  const clientPromise =
    globalForMongo.mongoClientPromise ??
    new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    }).connect();

  globalForMongo.mongoClientPromise = clientPromise;
  const client = await clientPromise;
  return client.db(process.env.MONGODB_DB?.trim() || undefined);
}

export async function getMenuCollection(): Promise<Collection<MenuStateDocument>> {
  const database = await getMongoDatabase();
  return database.collection<MenuStateDocument>(
    process.env.MONGODB_COLLECTION?.trim() || 'menu_state'
  );
}
