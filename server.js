import app from "./src/app.js";
import configDb from "./src/configs/config.mongodb.js";
import instanceDb from "./src/dbs/init.db.js";

const {
  app: { port },
} = configDb;

const PORT = port;

const server = app.listen(PORT, () => {
  console.log(`Web service eCommerce running on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log(`\nShutting down server...`);
  await instanceDb.disconnect();
  
  server.close(() => {
    console.log(`Server closed.`);
    process.exit(0);
  });
});
