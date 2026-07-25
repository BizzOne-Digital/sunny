import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dtdogs";
const MONGODB_DB = process.env.MONGODB_DB || "dtdogs";

const cached = global as typeof global & { 
  mongooseConnection?: Promise<typeof mongoose>;
  mongooseInstance?: typeof mongoose;
};

async function connectDB(): Promise<typeof mongoose> {
  if (cached.mongooseInstance) {
    return cached.mongooseInstance;
  }

  if (mongoose.connection.readyState >= 1) {
    cached.mongooseInstance = mongoose;
    return mongoose;
  }

  if (!cached.mongooseConnection) {
    cached.mongooseConnection = mongoose.connect(MONGODB_URI, {
      dbName: MONGODB_DB,
    });
  }

  cached.mongooseInstance = await cached.mongooseConnection;
  return cached.mongooseInstance;
}

export default connectDB;
