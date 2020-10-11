import { Request, Response } from 'express';
import { v4 } from 'uuid';
import { getUserValidation } from '../users';

describe('getUserValidation spec', () => {
  test('should call "next" without params if validation passed', () => {
    const res: Response = {} as Response;
    const next = jest.fn();
    const req: Request<{ id: string }> = { params: { id: v4() } } as Request<{
      id: string;
    }>;

    getUserValidation(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
});
