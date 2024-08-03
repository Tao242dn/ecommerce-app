"use strict";

import mongoose from "mongoose";
import configDb from "../configs/config.mongodb.js";

const {
  db: { username, password, cluster },
} = configDb;

const connectString = `mongodb+srv://${username}:${password}@${cluster}.kipqpva.mongodb.net/`;

class Database {
  #connection;
  constructor() {
    this.#connection = null; // Store the connection object
  }

  // Connect Db
  async connect(type = `mongodb`) {
    if (process.env.NODE_ENV === "dev") {
      // Only enable for debugging in non-production env
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    try {
      this.#connection = await mongoose.connect(connectString, {
        maxPoolSize: 50,
      });
      console.log(`Connected to MongoDB successfully.`);
    } catch (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
    }
  }

  // Disconnect Db
  async disconnect() {
    try {
      if (this.#connection) {
        // Only disconnect if a connection exits
        await this.#connection.disconnect();
        this.#connection = null; // Reset the connection object
        console.log(`Disconnected from MongoDB.`);
      } else {
        console.log(`No active MongoDB connection to disconnect.`);
      }
    } catch (err) {
      console.error(`Error disconnecting from MongoDB: ${err}`);
    }
  }

  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

const instanceDb = Database.getInstance();

export default instanceDb;
