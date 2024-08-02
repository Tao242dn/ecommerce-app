"use strict";

import mongoose from "mongoose";
import configDb from "../configs/config.mongodb.js";

const {
  db: { username, password, cluster },
} = configDb;

const connectString = `mongodb+srv://${username}:${password}@${cluster}.kipqpva.mongodb.net/`;

class Database {
  constructor() {}

  // Connect Db
  async connect(type = `mongodb`) {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    try {
      await mongoose.connect(connectString, { maxPoolSize: 50 });
      console.log(`Connected to MongoDB successfully.`);
    } catch (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
      process.exit(1);
    }
  }

  // Disconnect Db
  async disconnect() {
    try {
      await mongoose.disconnect();
      console.log(`Disconnected from MongoDB.`);
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
