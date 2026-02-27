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
  // Enable console logging by default (disable only if explicitly set to 'false')
  private readonly enableConsoleLogging = config.get('enableConsoleLogging') !== false;
  private readonly enableFileLogging = config.get('enableFileLogging') !== false;
  private context?: string;

  constructor() {
    if (this.enableFileLogging) {
      this.ensureLogStructure();
      this.cleanupOldLogs();
    }
  }

  /**
   * Set the context for this logger instance (e.g., 'AuthService', 'PostsController')
   */
  setContext(context: string) {
    this.context = context;
  }

  // 📂 Crée les dossiers log/error/warn...
  private ensureLogStructure() {
    if (!fs.existsSync(this.baseLogDir)) {
      fs.mkdirSync(this.baseLogDir, { recursive: true });
    }

    this.levels.forEach(level => {
      const levelDir = path.join(this.baseLogDir, level);
      if (!fs.existsSync(levelDir)) {
        fs.mkdirSync(levelDir);
      }
    });
  }

  // 🗃️ Crée le chemin du fichier pour chaque type de log
  private getLogFilePath(level: string): string {
    const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const levelDir = path.join(this.baseLogDir, level);
    return path.join(levelDir, `${date}.log`);
  }

  // ✍️ Écrit dans le fichier approprié (async pour ne pas bloquer)
  private writeToFile(level: string, message: string, context?: LogContext) {
    if (!this.enableFileLogging) return;

    const filePath = this.getLogFilePath(level);
    const timestamp = new Date().toISOString();
    
    // Structured logging format (JSON for easy parsing)
    const logEntry = {
      timestamp,
      level: level.toUpperCase(),
      context: this.context || 'Application',
      message,
      ...context,
    };

    const formatted = JSON.stringify(logEntry) + '\n';
    
    // Async write to avoid blocking
    fs.appendFile(filePath, formatted, { encoding: 'utf8' }, (err) => {
      if (err) {
        console.error(`Failed to write log: ${err.message}`);
      }
    });
  }

  // 🖥️ Écrit dans la console avec couleurs (pour dev)
  private writeToConsole(level: string, message: string, context?: LogContext) {
    const colors = {
      log: '\x1b[32m',      // Green
      error: '\x1b[31m',    // Red
      warn: '\x1b[33m',     // Yellow
      debug: '\x1b[36m',    // Cyan
      verbose: '\x1b[35m',  // Magenta
    };
    const reset = '\x1b[0m';
    const color = colors[level] || reset;
    
    // Format time as HH:MM:SS
    const now = new Date();
    const time = now.toTimeString().slice(0, 8); // Extract HH:MM:SS

    const contextStr = this.context ? `[${this.context}] ` : '';
    const metaStr = context ? ` ${JSON.stringify(context)}` : '';
    
    console.log(
      `${color}[${level.toUpperCase()}]${reset} ${time} ${contextStr}${message}${metaStr}`
    );
  }

  // 🧹 Supprime les fichiers trop anciens
  private cleanupOldLogs() {
    const now = new Date();

    this.levels.forEach(level => {
      const dirPath = path.join(this.baseLogDir, level);

      if (!fs.existsSync(dirPath)) return;

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

  // 🟢 Implémentation des méthodes Nest
  log(message: string, context?: LogContext) {
    if (this.enableConsoleLogging) {
      this.writeToConsole('log', message, context);
    }
    this.writeToFile('log', message, context);
  }

  error(message: string, trace?: string, context?: LogContext) {
    const errorMessage = `${message}${trace ? `\nTrace: ${trace}` : ''}`;
    if (this.enableConsoleLogging) {
      this.writeToConsole('error', errorMessage, context);
    }
    this.writeToFile('error', errorMessage, context);
  }

  warn(message: string, context?: LogContext) {
    if (this.enableConsoleLogging) {
      this.writeToConsole('warn', message, context);
    }
    this.writeToFile('warn', message, context);
  }

  debug(message: string, context?: LogContext) {
    if (this.enableConsoleLogging) {
      this.writeToConsole('debug', message, context);
    }
    this.writeToFile('debug', message, context);
  }

  verbose(message: string, context?: LogContext) {
    if (this.enableConsoleLogging) {
      this.writeToConsole('verbose', message, context);
    }
    this.writeToFile('verbose', message, context);
  }

  // 🔍 Additional utility methods for better context tracking
  logWithContext(level: 'log' | 'error' | 'warn' | 'debug' | 'verbose', message: string, context: LogContext) {
    if (level === 'error') {
      this.error(message, undefined, context);
    } else {
      this[level](message, context);
    }
  }

  // 📊 Log HTTP requests
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

  // ⚠️ Log errors with full context
  logError(error: Error, context?: LogContext) {
    this.error(error.message, error.stack, {
      ...context,
      errorName: error.name,
    });
  }
}
