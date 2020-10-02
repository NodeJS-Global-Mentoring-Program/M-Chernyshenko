import winston from 'winston';
import expressWinston, { LoggerOptions } from 'express-winston';
import { Handler, Request } from 'express';

type Options = LoggerOptions;

const logLevels = {
  emerg: 0,
  alert: 1,
  crit: 2,
  error: 3,
  warning: 4,
  notice: 5,
  info: 6,
  debug: 7,
};

const msgFormatter = (req: Request): string => {
  const { body, query, params } = req;
  const notEmpty = (obj: Record<string, unknown>) =>
    Object.keys(obj).length > 0;
  const formatParams = (type: string, ojb: Record<string, string>) => {
    const arr = Object.keys(ojb).map((key) => `${key}: ${body[key]}`);
    return `${type}: {${arr.join(', ')}}`;
  };
  const paramExist = (param: Record<string, unknown>) =>
    typeof param === 'object' && notEmpty(param);
  if (paramExist(body)) {
    return formatParams('Body', body);
  }
  if (paramExist(query)) {
    return formatParams('Query', query as Record<string, string>);
  }
  if (paramExist(params)) {
    return formatParams('Params', params);
  }

  return '';
};

const createExpressLogger = (options?: Options): Handler =>
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
      winston.format.json(),
      winston.format.colorize()
    ),
    msg: msgFormatter,
    expressFormat: true,
    meta: false,
    ...options,
  });

class Logger {
  private _expressLogger: Handler;
  private _level: keyof typeof logLevels = 'warning';
  private _winston: typeof winston;
  private _logger: winston.Logger;

  constructor(options?: Options) {
    this._expressLogger = createExpressLogger(options);
    this._winston = winston;
    this._logger = this._winston.createLogger({
      transports: [new this._winston.transports.Console()],
    });
  }

  public get level(): keyof typeof logLevels {
    return this._level;
  }

  public set level(level: keyof typeof logLevels) {
    this._level = level;
  }

  public getExpressLogger(): Handler {
    return this._expressLogger;
  }

  public log(error: any): void {
    this._logger.log(this._level, error);
  }

  public error(error: any): void {
    this._logger.error(error);
  }

  public warn(message: string): void {
    this._logger.warn(message);
  }

  public info(message: string): void {
    this._logger.info(message);
  }
}

export class LoggerFactory {
  private static loggers: Record<string, Logger> = {};

  private constructor() {}

  public static getLogger(name: string, options?: Options): Logger {
    if (this.loggers[name] === undefined) {
      this.createLogger(name, options);
    }
    return this.loggers[name];
  }

  public static deleteLogger(name: string): void {
    delete this.loggers[name];
  }

  private static createLogger(name: string, options?: Options): void {
    this.loggers[name] = new Logger(options);
  }
}
