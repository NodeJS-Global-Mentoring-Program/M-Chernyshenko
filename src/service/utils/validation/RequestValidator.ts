import Ajv from 'ajv';
import { Request } from 'express';

import { ApiMiddleware } from '../../types';
import { ApiResponse } from '../ApiResponse';
import { formatErrors } from '../routes';
import { validateString } from './keywords';
import { IAjvKeyword, IAjvSchema } from './types';

type RequestPayloadType = 'body' | 'query' | 'params';

export const REQUEST_PAYLOAD_TYPE: { [P in RequestPayloadType]: P } = {
  body: 'body',
  params: 'params',
  query: 'query',
};

export const getPayload = (
  req: Request,
  requestPayloadType: RequestPayloadType
): any => {
  switch (requestPayloadType) {
    case REQUEST_PAYLOAD_TYPE.body: {
      return req.body;
    }
    case REQUEST_PAYLOAD_TYPE.params: {
      return req.params;
    }
    case REQUEST_PAYLOAD_TYPE.query: {
      return req.query;
    }

    default: {
      const neverRequestPayloadType: never = requestPayloadType;
      throw new Error('unknown payload type');
    }
  }
};

export class RequestValidator {
  private ajv;

  constructor(options?: Ajv.Options) {
    this.ajv = new Ajv(options);
    this.addKeyword(validateString);
  }

  public addKeyword(ajvKeywordConfig: IAjvKeyword): this {
    this.ajv.addKeyword(ajvKeywordConfig.key, ajvKeywordConfig.definition);
    return this;
  }

  public createRequestValidator<Body extends UnknownRecord>(
    schema: IAjvSchema,
    requestPayloadType: RequestPayloadType = REQUEST_PAYLOAD_TYPE.body
  ): ApiMiddleware<Body> {
    const ajvValidate = this.ajv.compile(schema);

    const requestMiddleware: ApiMiddleware<Body> = (req, res, next) => {
      const payload = getPayload(req, requestPayloadType);
      const isValid = ajvValidate(payload);
      if (isValid === false) {
        const errors = formatErrors(ajvValidate.errors);
        return next(errors);
      }
      next();
    };
    return requestMiddleware;
  }
}
