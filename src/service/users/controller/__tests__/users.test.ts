import { NextFunction, Request, Response } from 'express';
import { ApiError } from '../../../utils/ApiError';
import { ApiResponse } from '../../../utils/ApiResponse';
import { deleteUser, getUser, getUsers } from '../service';

jest.mock('../../api/UserRepository.ts');

describe('users spec', () => {
  describe('getUser spec', () => {
    test('should call "next" with ApiError if user not found', async () => {
      const req: Request<{ id: string }> = { params: { id: '' } } as Request<{
        id: string;
      }>;
      const json = jest.fn() as any;
      const res: Response = {
        json,
      } as Response;
      const next: NextFunction = jest.fn();

      await getUser(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        new ApiError({ code: 400, message: 'user not found' })
      );

      expect(json).not.toHaveBeenCalled();
    });

    test('should call "res.json" and pass ApiResponse with user', async () => {
      const req: Request<{ id: string }> = {
        params: { id: 'f4faa5ad-f654-46f4-91f0-c08b73cd691d' },
      } as Request<{
        id: string;
      }>;
      const json = jest.fn() as any;
      const res: Response = {
        json,
      } as Response;
      const next: NextFunction = jest.fn();

      await getUser(req, res, next);

      expect(next).not.toHaveBeenCalled();

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith(
        new ApiResponse({
          data: {
            user: {
              uuid: 'f4faa5ad-f654-46f4-91f0-c08b73cd691d',
              age: 28,
              login: 'login1',
              isDeleted: false,
            },
          },
        })
      );
    });
  });

  describe('deleteUser spec', () => {
    test('should call "res" with 204 code if user successfully deleted', async () => {
      const req: Request<{ id: string }> = {
        params: { id: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825' },
      } as Request<{ id: string }>;
      const send = jest.fn() as any;
      const status = jest.fn() as any;
      const res: Response = { status, send } as Response;
      const next: NextFunction = jest.fn();

      await deleteUser(req, res, next);

      expect(status).toHaveBeenCalledTimes(1);
      expect(status).toHaveBeenCalledWith(204);

      expect(send).toHaveBeenCalledTimes(1);
    });

    test('should call "res" with 410 code if user not exist or already deleted', async () => {
      [
        'f3b5dd22-64f3-4d28-9ee7-d6bd651052cb',
        'f2699514-c236-4a2b-b0ba-004a0830fed8',
      ].forEach(async (id) => {
        const req: Request<{ id: string }> = {
          params: { id },
        } as Request<{ id: string }>;
        const send = jest.fn() as any;
        const status = jest.fn() as any;
        const res: Response = { status, send } as Response;
        const next: NextFunction = jest.fn();

        await deleteUser(req, res, next);
        expect(status).toHaveBeenCalledTimes(1);
        expect(status).toHaveBeenCalledWith(410);

        expect(send).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('getUsers spec', () => {
    interface Query {
      limit?: string;
      loginSubstring?: string;
      findDeleted?: string;
    }

    test('should find deleted users', async () => {
      const query: Query = {
        limit: '1',
        loginSubstring: 'login2',
        findDeleted: '1',
      };
      const whenReq = {
        query,
      } as any;
      const whenJson = jest.fn() as any;
      const whenRes: Response = { json: whenJson } as Response;
      const whenNext: NextFunction = jest.fn();

      const thenUser = {
        login: 'login2',
        age: 23,
        isDeleted: true,
        uuid: 'f2699514-c236-4a2b-b0ba-004a0830fed8',
      };
      const { result } = new ApiResponse({ data: { users: [thenUser] } });

      await getUsers(whenReq, whenRes, whenNext);

      expect(whenJson).toHaveBeenCalledTimes(1);
      expect(whenJson).toHaveBeenCalledWith(result);
    });

    test('should return empty array if "limit" === 0', async () => {
      const query: Query = {
        limit: '0',
      };
      const whenReq = {
        query,
      } as any;
      const whenJson = jest.fn();
      const whenRes: Response = { json: whenJson as any } as Response;
      const whenNext: NextFunction = jest.fn();

      await getUsers(whenReq, whenRes, whenNext);

      expect(whenJson).toHaveBeenCalledTimes(1);
      expect(whenJson.mock.calls[0][0].data.users).toHaveLength(0);
    });

    test('should return count of users by limit', async () => {
      const query: Query = {
        limit: '2',
        loginSubstring: 'login',
      };
      const whenReq = {
        query,
      } as any;
      const whenJson = jest.fn();
      const whenRes: Response = { json: whenJson as any } as Response;
      const whenNext: NextFunction = jest.fn();

      await getUsers(whenReq, whenRes, whenNext);

      expect(whenJson).toHaveBeenCalledTimes(1);
      expect(whenJson.mock.calls[0][0].data.users).toHaveLength(2);
    });

    test('should sort user by "login" is ASC order', async () => {
      const query: Query = {
        findDeleted: '0',
      };
      const whenReq = {
        query,
      } as any;
      const whenJson = jest.fn() as any;
      const whenRes: Response = { json: whenJson } as Response;
      const whenNext: NextFunction = jest.fn();

      const thenUsers = [
        {
          login: 'login',
          age: 23,
          isDeleted: false,
          uuid: '8e3f174f-e5a4-4f47-b5ff-71c19d7c0825',
        },
        {
          uuid: 'f4faa5ad-f654-46f4-91f0-c08b73cd691d',
          age: 28,
          login: 'login1',
          isDeleted: false,
        },
      ];
      const { result } = new ApiResponse({ data: { users: thenUsers } });

      await getUsers(whenReq, whenRes, whenNext);

      expect(whenJson).toHaveBeenCalledTimes(1);
      expect(whenJson).toHaveBeenCalledWith(result);
    });
  });
});
