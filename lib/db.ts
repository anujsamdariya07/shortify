import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define your mongodb uri in env file!");
}

// This helps avoid unnecessary reconnections in serverless environments
let cached = global.mongoose;

// Initialize it if it doesnt exists
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    // Return immediately to prevent redundant reductions
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // If we perform operations like find() and the db connection has not been established yet, then mongoose will hold off commands in a queue format
      bufferCommands: true,
      // Maximum number of connections that can be open simultaneously
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw new Error("Error while establishing connection with the database!");
  }

  return cached.conn;
}
