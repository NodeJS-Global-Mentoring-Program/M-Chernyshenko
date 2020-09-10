import winston from 'winston';
import expressWinston, { LoggerOptions } from 'express-winston';
import { Handler } from 'express';

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

const createLogger = (options?: Options): Handler =>
  expressWinston.logger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json()),
    meta: false,
    expressFormat: true,
    ...options,
  });

class Logger {
  private _logger: Handler;
  private _level: keyof typeof logLevels = 'warning';

  constructor(options?: Options) {
    this._logger = createLogger(options);
  }

  public get level(): keyof typeof logLevels {
    return this._level;
  }

  public set level(level: keyof typeof logLevels) {
    this._level = level;
  }

  public get logger(): Handler {
    return this._logger;
  }

  public log(message: string): void {
    console.log(message);
  }
}

const logger = new Logger();
export { logger };
