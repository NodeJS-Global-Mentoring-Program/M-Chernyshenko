import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ajv } from '../../utils/ajv';
import { formatErrors } from './formatErrors';

type AnyRecord = Record<string, any>;
interface CustomRequest<Body extends AnyRecord> extends Request {
  body: Body;
}

export const createRequestValidator = <Body extends AnyRecord>(
  schema: any,
  useBody = true,
): RequestHandler<any, any, Body, any> => {
  const ajvValidate = ajv.compile(schema);

  return (
    req: CustomRequest<Body>,
    res: Response,
    next: NextFunction
  ): void => {
    const isValid = ajvValidate(useBody ? req.body : req.query);
    if (isValid === false) {
      const errors = formatErrors(ajvValidate.errors);
      res.status(400).json({ errors });
      return;
    }
    next();
  };
};
