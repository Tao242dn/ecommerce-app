import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import instanceDb from './dbs/init.db.js';
import { checkOverload } from './helpers/check.connect.js';
import router from './routes/index.js';

const app = express();

// Init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Init db
await instanceDb.connect();
// checkOverload();

// Init routes
app.use(router);

// Handle errors
app.use((req, res, next) => {
  const error = new Error('Server Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message: error.message || 'Internal Server Error',
    stack: error.stack,
  });
});

export default app;
