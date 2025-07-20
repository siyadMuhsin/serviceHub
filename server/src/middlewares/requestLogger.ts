import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import chalk from 'chalk'; // or use 'colors' package

// Color mapping for HTTP methods
const methodColors: Record<string, (text: string) => string> = {
  GET: chalk.green.bold,
  POST: chalk.blue.bold,
  PUT: chalk.yellow.bold,
  DELETE: chalk.red.bold,
  PATCH: chalk.magenta.bold,
  OPTIONS: chalk.cyan.bold,
  HEAD: chalk.gray.bold,
};

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const coloredMethod = methodColors[req.method]?.(req.method) || req.method;

  // Incoming request log
  logger.http(
    `${chalk.bold('→')} ${coloredMethod} ${req.path} ${chalk.gray(`from ${req.ip}`)}`
  );

  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = 
      res.statusCode >= 500 ? chalk.red :
      res.statusCode >= 400 ? chalk.yellow :
      res.statusCode >= 300 ? chalk.cyan :
      chalk.green;

    // Completed request log
    logger.http(
      `${chalk.bold('←')} ${coloredMethod} ${req.path} ` +
      `${statusColor(`${res.statusCode}`)} ${chalk.gray(`(${duration}ms)`)}`
    );
  });

  next();
};