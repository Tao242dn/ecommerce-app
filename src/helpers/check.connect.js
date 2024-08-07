'use strict';

import mongoose from 'mongoose';
import os from 'node:os';
import process from 'node:process';

const _SECONDS = 5000;

// Count connect
export const countConnect = () => {
  const numConnection = mongoose.connections.length;
  return numConnection;
};

// Check overload
export const checkOverload = () => {
  const numCores = os.cpus().length;
  const maxConnections = numCores * 5;

  setInterval(() => {
    const numConnection = countConnect();
    // Example maximum connections based on the number of cores
    const memoryUsage = process.memoryUsage().rss / 1024 / 1024; // convert to B -> KB -> MB

    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage: ${memoryUsage.toFixed(2)} MB`); // rounds the number to 2 decimal places

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected!`);
    }
  }, _SECONDS);
};
