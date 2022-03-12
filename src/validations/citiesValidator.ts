import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
export const citiesSuggestionValidator = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const schema = Joi.object().keys({
    q: Joi.string().required(),
    latitude: Joi.number(),
    longitude: Joi.number(),
    radius: Joi.number(),
    sort: Joi.string()
      .when('latitude', {
        not: Joi.exist(),
        then: Joi.string().valid('name'),
      })
      .when('longitude', {
        not: Joi.exist(),
        then: Joi.string().valid('name'),
      })
      .when('latitude', {
        is: Joi.exist(),
        then: Joi.when('longitude', {
          is: Joi.exist(),
          then: Joi.string().valid('name', 'distance'),
        }),
      }),
  });
  const { q, longitude, latitude, radius, sort } = req.query;
  schema
    .validateAsync({ q, longitude, latitude, radius, sort })
    .then((val) => {
      req.query = val;
      next();
    })
    .catch((err) => {
      return res.status(400).json({
        message: 'Failed to validate input ' + err.details[0].message,
      });
    });
};
