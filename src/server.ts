import morgan from 'morgan';
import helmet from 'helmet';
import express from 'express';
import baseRouter from './routes';
import errorMiddleware from './middlewares/errorMiddleware';
import rateLimiterMiddleware from './middlewares/rateLimiterMiddleware';

// Init express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimiterMiddleware);

// Add APIs
app.use('/api', baseRouter);

// Print API errors
app.use(errorMiddleware);

export default app;
