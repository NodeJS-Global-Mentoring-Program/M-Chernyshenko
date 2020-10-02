import { Router, RouterOptions } from 'express';
import { ApiMiddleware } from './types';
import { ApiError } from './utils/ApiError';
import { checkToken } from './utils/routes/checkToken';

type IMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export const HTTP_METHOD: { [P in IMethod]: P } = {
  DELETE: 'DELETE',
  GET: 'GET',
  PATCH: 'PATCH',
  POST: 'POST',
  PUT: 'PUT',
};

type AnyMiddleware = ApiMiddleware<any, any, any>;
type PathMiddlewares = Record<IMethod, AnyMiddleware[]>;
type Middlewares = Record<string, PathMiddlewares>;

interface HttpMethodOptions {
  auth?: boolean;
}

interface IController {
  get(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this;
  post(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this;
  patch(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this;
  delete(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this;
  getRouter(): Router;
}

const defaultOptions: HttpMethodOptions = {
  auth: true,
};

const handleMiddlewares = (middlewares: AnyMiddleware[]): AnyMiddleware[] => {
  const resFunctions: AnyMiddleware[] = middlewares.map((middleware) => {
    return async (req, res, next) => {
      try {
        await middleware(req, res, next);
        return;
      } catch (e) {
        return next(new ApiError({ code: 500, message: e.message }));
      }
    };
  });
  return resFunctions;
};

const getDefaultMiddlewares = (): PathMiddlewares => ({
  [HTTP_METHOD.GET]: [],
  [HTTP_METHOD.POST]: [],
  [HTTP_METHOD.PUT]: [],
  [HTTP_METHOD.PATCH]: [],
  [HTTP_METHOD.DELETE]: [],
});

export class Controller implements IController {
  private _router;
  private _path = '/';

  private _middlewares: Middlewares;

  constructor(routerOptions?: RouterOptions) {
    this._router = Router(routerOptions);
    this._middlewares = {};
  }

  public getRouter(): Router {
    const router = this._router;
    Object.keys(this._middlewares).forEach((route) => {
      const routeMiddlewares = this._middlewares[route];
      (Object.keys(routeMiddlewares) as IMethod[]).forEach((method) => {
        const wrappedMiddlewares = handleMiddlewares(routeMiddlewares[method]);
        switch (method) {
          case HTTP_METHOD.GET:
            router.get(route, wrappedMiddlewares);
            break;
          case HTTP_METHOD.POST:
            router.post(route, wrappedMiddlewares);
            break;
          case HTTP_METHOD.PATCH:
            router.patch(route, wrappedMiddlewares);
            break;
          case HTTP_METHOD.PUT:
            router.put(route, wrappedMiddlewares);
            break;
          case HTTP_METHOD.DELETE:
            router.delete(route, wrappedMiddlewares);
            break;
          default:
            break;
        }
      });
    });
    return this._router;
  }

  public setPath(path: string): this {
    this._path = path;
    return this;
  }

  public get(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this {
    this.addMiddlewares(HTTP_METHOD.GET, middlewares, options);
    return this;
  }
  public post(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this {
    this.addMiddlewares(HTTP_METHOD.POST, middlewares, options);
    return this;
  }
  public patch(
    middlewares: AnyMiddleware[],
    options?: HttpMethodOptions
  ): this {
    this.addMiddlewares(HTTP_METHOD.PATCH, middlewares, options);
    return this;
  }
  public put(middlewares: AnyMiddleware[], options?: HttpMethodOptions): this {
    this.addMiddlewares(HTTP_METHOD.PUT, middlewares, options);
    return this;
  }
  public delete(
    middlewares: AnyMiddleware[],
    options?: HttpMethodOptions
  ): this {
    this.addMiddlewares(HTTP_METHOD.DELETE, middlewares, options);
    return this;
  }

  private initRouteMiddlewares(): void {
    if (this._middlewares[this._path] === undefined) {
      this._middlewares[this._path] = getDefaultMiddlewares();
    }
  }

  protected addMiddlewares(
    method: IMethod,
    middlewares: AnyMiddleware[],
    options: HttpMethodOptions = defaultOptions
  ): void {
    this.initRouteMiddlewares();

    const { auth = true } = options;

    const routeMiddlewares = this._middlewares[this._path][method];
    middlewares.forEach((middleware) => {
      if (auth === true) {
        routeMiddlewares.push(checkToken);
      }
      routeMiddlewares.push(middleware);
    });
  }
}
