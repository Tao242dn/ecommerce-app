import "dotenv/config";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 4000,
  },
  db: {
    username: process.env.DEV_MONGODB_USERNAME || "root",
    password: process.env.DEV_MONGODB_PASSWORD || "root",
    cluster: process.env.DEV_MONGODB_CLUSTER || "cluster-0",
  },
};

const pro = {
  app: {
    port: process.env.PRO_APP_PORT || 3000,
  },
  db: {
    username: process.env.PRO_MONGODB_USERNAME || "admin",
    password: process.env.PRO_MONGODB_PASSWORD || "admin",
    cluster: process.env.PRO_MONGODB_CLUSTER || "cluster-0",
  },
};

const configDb = { dev, pro };
const env = process.env.NODE_ENV || "dev";

console.log(`App is running on ${env} environment`);
export default configDb[env];
