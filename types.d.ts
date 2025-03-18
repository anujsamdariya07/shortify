import { Connection } from "mongoose";

declare global {
  var mongoose: {
    // For storing the actual database connection
    conn: Connection | null;
    // For storing a promise that resolves once the database connection is established
    promise: Promise<Connection> | null;
  };
}

export {};
