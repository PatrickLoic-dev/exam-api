// src/common/logging/logger.service.ts
import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { config } from '../../../config';

interface LogContext {
  userId?: string;
  requestId?: string;
  module?: string;
  [key: string]: any;
}

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly baseLogDir = path.resolve(__dirname, '../../../logs');
  private readonly retentionDays = 90;
  private readonly levels = ['log', 'error', 'warn', 'debug', 'verbose'];
  private readonly enableConsoleLogging: boolean = config.get('enableConsoleLogging') === true;
  private readonly enableFileLogging: boolean = config.get('enableFileLogging') === true;
  private context?: string;

  constructor() {
    if (this.enableFileLogging) {
      this.ensureLogStructure();
      this.cleanupOldLogs();
    }
  }

  setContext(context: string) {
    this.context = context;
  }

  private ensureLogStructure() {
    fs.mkdirSync(this.baseLogDir, { recursive: true });
    this.levels.forEach(level => {
      fs.mkdirSync(path.join(this.baseLogDir, level), { recursive: true });
    });
  }

  private getLogFilePath(level: string): string {
    const date = new Date().toISOString().slice(0, 10);
    return path.join(this.baseLogDir, level, `${date}.log`);
  }

  private writeToFile(level: string, message: string, extraContext?: any) {

    const filePath = this.getLogFilePath(level);
    const timestamp = new Date().toISOString();
    const ctx = this.context ?? (typeof extraContext === 'string' ? extraContext : 'Application');

    const logEntry: Record<string, any> = {
      timestamp,
      level: level.toUpperCase(),
      context: ctx,
      message,
    };

    if (extraContext && typeof extraContext === 'object') {
      Object.assign(logEntry, extraContext);
    }

    const formatted = JSON.stringify(logEntry) + '\n';

    fs.appendFile(filePath, formatted, { encoding: 'utf8' }, (err) => {
      if (err) console.error(`Failed to write log: ${err.message}`);
    });
  }

  private writeToConsole(level: string, message: string, extraContext?: any) {
    const colors: Record<string, string> = {
      log: '[32m',
      error: '[31m',
      warn: '[33m',
      debug: '[36m',
      verbose: '[35m',
    };
    const reset = '[0m';
    const color = colors[level] ?? reset;
    const time = new Date().toTimeString().slice(0, 8);
    const ctx = this.context ?? (typeof extraContext === 'string' ? extraContext : undefined);
    const contextStr = ctx ? `[${ctx}] ` : '';
    const metaStr = extraContext && typeof extraContext === 'object'
      ? ` ${JSON.stringify(extraContext)}`
      : '';
    const formatted = `${color}[${level.toUpperCase()}]${reset} ${time} ${contextStr}${message}${metaStr}`;

    if (level === 'error') console.error(formatted);
    else if (level === 'warn') console.warn(formatted);
    else console.log(formatted);
  }

  private cleanupOldLogs() {
    const now = new Date();
    this.levels.forEach(level => {
      const dirPath = path.join(this.baseLogDir, level);
      fs.readdirSync(dirPath).forEach(file => {
        const match = file.match(/^(\d{4}-\d{2}-\d{2})\.log$/);
        if (match) {
          const fileDate = new Date(match[1]);
          const diffDays = (now.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24);
          if (diffDays > this.retentionDays) {
            fs.unlinkSync(path.join(dirPath, file));
          }
        }
      });
    });
  }

  log(message: any, ...optionalParams: any[]) {
    const extra = optionalParams[0];
    if (this.enableConsoleLogging) this.writeToConsole('log', String(message), extra);
    if (this.enableFileLogging)    this.writeToFile('log',    String(message), extra);
  }

  error(message: any, ...optionalParams: any[]) {
    const [traceOrContext, context] = optionalParams;
    const trace = typeof traceOrContext === 'string' ? traceOrContext : undefined;
    const extra = typeof traceOrContext === 'object' ? traceOrContext : context;
    const errorMessage = `${message}${trace ? `
Trace: ${trace}` : ''}`;
    if (this.enableConsoleLogging) this.writeToConsole('error', errorMessage, extra);
    if (this.enableFileLogging)    this.writeToFile('error',    errorMessage, extra);
  }

  warn(message: any, ...optionalParams: any[]) {
    const extra = optionalParams[0];
    if (this.enableConsoleLogging) this.writeToConsole('warn', String(message), extra);
    if (this.enableFileLogging)    this.writeToFile('warn',    String(message), extra);
  }

  debug(message: any, ...optionalParams: any[]) {
    const extra = optionalParams[0];
    if (this.enableConsoleLogging) this.writeToConsole('debug', String(message), extra);
    if (this.enableFileLogging)    this.writeToFile('debug',    String(message), extra);
  }

  verbose(message: any, ...optionalParams: any[]) {
    const extra = optionalParams[0];
    if (this.enableConsoleLogging) this.writeToConsole('verbose', String(message), extra);
    if (this.enableFileLogging)    this.writeToFile('verbose',    String(message), extra);
  }

  logWithContext(level: 'log' | 'error' | 'warn' | 'debug' | 'verbose', message: string, context: LogContext) {
    this[level](message, context);
  }

  logRequest(method: string, url: string, userId?: string, statusCode?: number, duration?: number) {
    this.log(`${method} ${url}`, {
      type: 'http-request',
      method,
      url,
      userId,
      statusCode,
      duration: duration ? `${duration}ms` : undefined,
    });
  }

  logError(error: Error, context?: LogContext) {
    this.error(error.message, error.stack, {
      ...context,
      errorName: error.name,
    });
  }
}
