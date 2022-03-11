import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const citiesSuggestionValidator = async (req: Request, res: Response, next: NextFunction) => {
  const schema =
    Joi.object().keys({
      q: Joi.string()
        .required(),
      latitude: Joi.number(),
      longitude: Joi.number(),
      radius: Joi.number(),
      sort: Joi.string().valid("name", "distance")
    });
  const { q, longitude, latitude, radius, sort } = req.query;
  schema.validateAsync({ q, longitude, latitude, radius, sort }).then(val => {
    req.query = val;
    next();
  }).catch(err => {
    return res.status(400).json('Failed to validate input ' + err.details[0].message);
  })
}