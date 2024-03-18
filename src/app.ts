import express, { Request, Response, NextFunction } from 'express';
import Logger from './core/Logger';
import cors from 'cors';
import './database'; // import database connection
import { environment, urlConfigEncode } from './config';
import { NotFoundError, ApiError } from './core/ApiError';
import routes from './routes';

process.on('uncaughtException', (e) => {
  Logger.error(e);
});

const app = express();
// middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded(urlConfigEncode));
app.use(cors({ origin: '*', optionsSuccessStatus: 200 }));
//routes
app.use('/api/v1', routes);
// not found error
app.use((req: Request, res: Response, next: NextFunction) =>
  next(new NotFoundError()),
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (environment === 'development') {
      Logger.error(err);
      return res;
    }
  }
});

export default app;
