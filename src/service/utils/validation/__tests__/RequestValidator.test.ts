import { NextFunction, Request, Response } from 'express';
import { ApiMiddleware } from '../../../types';
import { ApiResponse } from '../../ApiResponse';
import {
  getPayload,
  RequestValidator,
  REQUEST_PAYLOAD_TYPE,
} from '../RequestValidator';

jest.mock('ajv');

describe('getPayload spec', () => {
  test(`should return "body" from request if "requestPayloadType" === "${REQUEST_PAYLOAD_TYPE.body}"`, () => {
    const body = {};
    const req: Request = { body } as Request;

    expect(getPayload(req, REQUEST_PAYLOAD_TYPE.body)).toBe(body);
  });

  test(`should return "params" from request if "requestPayloadType" === "${REQUEST_PAYLOAD_TYPE.params}"`, () => {
    const params = {};
    const req: Request = { params } as Request;

    expect(getPayload(req, REQUEST_PAYLOAD_TYPE.params)).toBe(params);
  });

  test(`should return "query" from request if "requestPayloadType" === "${REQUEST_PAYLOAD_TYPE.query}"`, () => {
    const query = {};
    const req: Request = { query } as Request;

    expect(getPayload(req, REQUEST_PAYLOAD_TYPE.query)).toBe(query);
  });
});

describe('RequestValidator spec', () => {
  test('should return validation middleware', () => {
    const validator = new RequestValidator();
    const requestValidateMiddleware: ApiMiddleware = validator.createRequestValidator(
      {},
      REQUEST_PAYLOAD_TYPE.body
    );

    expect(typeof requestValidateMiddleware === 'function').toBe(true);
  });

  test('should return middleware that stop middlewares chain if validation failed', () => {
    const validator = new RequestValidator();
    const requestValidateMiddleware: ApiMiddleware = validator.createRequestValidator(
      {},
      REQUEST_PAYLOAD_TYPE.body
    );

    const apiResponse = new ApiResponse({ errors: [] });

    const req: Request = { body: { isValid: false } } as Request;
    const next: NextFunction = jest.fn();
    const json = jest.fn() as any;

    const status = jest.fn<Response, any[]>(
      () =>
        ({
          json,
        } as Response)
    );
    const res: Response = {} as Response;
    res.status = status;

    expect(typeof requestValidateMiddleware === 'function').toBe(true);
    requestValidateMiddleware(req, res, next);

    expect(status).toHaveBeenCalledTimes(1);
    expect(status).toHaveBeenCalledWith(400);

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenCalledWith(apiResponse);

    expect(next).not.toHaveBeenCalled();
  });

  test('should return middleware that call "next" if validation passed', () => {
    const validator = new RequestValidator();
    const requestValidateMiddleware: ApiMiddleware = validator.createRequestValidator(
      {},
      REQUEST_PAYLOAD_TYPE.body
    );

    const req: Request = { body: { isValid: true } } as Request;
    const next: NextFunction = jest.fn();
    const res: Response = {} as Response;

    expect(typeof requestValidateMiddleware === 'function').toBe(true);
    requestValidateMiddleware(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
