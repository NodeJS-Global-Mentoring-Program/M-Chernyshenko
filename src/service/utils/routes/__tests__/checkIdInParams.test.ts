import { Request, Response } from 'express';
import { checkIdInParams } from '../checkIdInParams';

describe('checkIdInParams spec', () => {
  test('should invoke "next" argument without params if "id" in params', () => {
    const next = jest.fn();
    const req: Request<{ id: string }> = {
      params: { id: 'id' },
    } as Request<{ id: string }>;
    const res: Response = {} as Response;

    checkIdInParams(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  test('should invoke "next" argument with "router" argument if "id" not passed id params', () => {
    const next = jest.fn();
    const req: Request<{ id: string }> = {} as Request<{ id: string }>;
    const res: Response = {} as Response;

    checkIdInParams(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('router');
  });
});
