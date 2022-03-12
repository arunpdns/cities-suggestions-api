import logger from '../shared/Logger';
import httpStatus from 'http-status';
import { Request, Response, Error, NextFunction } from 'express';

/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  let { statusCode, message } = err;
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'production' && !err.isOperational) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  };

  logger.error(err);
  res.status(statusCode).send(response);
};

export default errorHandler;
