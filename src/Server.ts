import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, {  Response } from 'express';

import BaseRouter from './routes';
import logger from './shared/Logger';

import rateLimit from 'express-rate-limit';


const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 15 minutes
	max: 50, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
// Init express
const app = express();



/************************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(limiter);
// Add APIs
app.use('/api', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error,  res: Response) => {
    logger.error(err.message, err);
    return res.status(500).json({
        error: err.message,
    });
});



// Export express instance
export default app;
