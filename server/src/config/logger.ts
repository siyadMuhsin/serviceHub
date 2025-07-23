// logger.ts
import fs from 'fs';
import path from 'path';
import { createLogger, format, transports, Logger } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

// Create logs directory
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Define the correct type for log info
interface LogInfo extends Record<string, unknown> {
  level: string;
  message: string;
  timestamp?: string;
  stack?: string;
  [key: string]: unknown;
}

// Create the logger with proper typing
const isProduction = process.env.NODE_ENV === 'production';

const transportsArray = [];

// Always log errors to file
transportsArray.push(
  new DailyRotateFile({
    filename: path.join(logDir, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  })
);

if (isProduction) {
  // In production, also write combined logs if needed
  transportsArray.push(
    new DailyRotateFile({
      filename: path.join(logDir, 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'info', // optional: change to 'warn' or 'error' if you want fewer
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    })
  );
}

const logger: Logger = createLogger({
  level: isProduction ? 'info' : 'http',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: transportsArray,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logDir, 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
    }),
  ],
});

// Console logging (always in development, optional in production)
if (!isProduction) {
  logger.add(
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level, message, stack, ...rest } = info as LogInfo;
          let log = `${timestamp} [${level}]: ${message}`;

          if (stack) {
            log += `\n${stack}`;
          }

          if (Object.keys(rest).length > 0) {
            log += `\n${JSON.stringify(rest, null, 2)}`;
          }

          return log;
        })
      ),
    })
  );
}

export default logger;