import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import instanceDb from "./dbs/init.db.js";
import { checkOverload } from "./helpers/check.connect.js";

const app = express();

// Init middlewares
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// Init db
await instanceDb.connect();
// checkOverload();

// Init routes
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: `Hello World Ho He He`,
  });
});

// Handle errors

export default app;
