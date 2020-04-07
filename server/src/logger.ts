import { join, resolve } from 'path';
import { createLogger, format, transports } from 'winston';

const logsDir = resolve('logs');

export const logger = createLogger({
  level: 'info',
  format: format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `info.log`
    new transports.File({ filename: join(logsDir, 'error.log'), level: 'error' }),
    new transports.File({ filename: join(logsDir, 'info.log') }),
  ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.simple(),
    })
  );
}

export class LoggerStream {
  write(text: string) {
    logger.info(text);
  }
}
