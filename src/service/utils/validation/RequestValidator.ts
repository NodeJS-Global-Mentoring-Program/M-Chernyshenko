import Ajv from 'ajv';
import { Request } from 'express';

import { ApiMiddleware } from '../../types';
import { ApiResponse } from '../ApiResponse';
import { formatErrors } from '../routes';
import { validateString } from './keywords';
import { IAjvKeyword } from './types';

type RequestPayloadType = 'body' | 'query' | 'params';

export const REQUEST_PAYLOAD_TYPE: { [P in RequestPayloadType]: P } = {
  body: 'body',
  params: 'params',
  query: 'query',
};

const getPayload = (
  req: Request,
  requestPayloadtype: RequestPayloadType
): any => {
  if (requestPayloadtype === REQUEST_PAYLOAD_TYPE.body) {
    return req.body;
  }
  if (requestPayloadtype === REQUEST_PAYLOAD_TYPE.params) {
    return req.params;
  }
  return req.query;
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
    schema: any,
    requestPayloadType: RequestPayloadType = REQUEST_PAYLOAD_TYPE.body
  ): ApiMiddleware<Body> {
    const ajvValidate = this.ajv.compile(schema);

    const requestMiddleware: ApiMiddleware<Body> = (req, res, next) => {
      const payload = getPayload(req, requestPayloadType);
      const isValid = ajvValidate(payload);
      if (isValid === false) {
        const errors = formatErrors(ajvValidate.errors);
        res.status(400).json(new ApiResponse({ errors }));
        return;
      }
      next();
    };
    return requestMiddleware;
  }
}
