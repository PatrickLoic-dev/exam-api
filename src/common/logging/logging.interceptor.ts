// src/common/logging/logging.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from './logging.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly logger: LoggerService) {}

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const { method, url, body, user } = request;
        const startTime = Date.now();

        // Log incoming request with inline context string — does NOT overwrite instance context
        this.logger.log(`Incoming ${method} ${url}`, {
            type: 'request',
            method,
            url,
            userId: user?.id,
            body: this.sanitizeBody(body),
            context: 'HTTP',
        });

        return next.handle().pipe(
            tap({
                next: (data) => {
                    const duration = Date.now() - startTime;
                    const response = context.switchToHttp().getResponse();

                    this.logger.logRequest(
                        method,
                        url,
                        user?.id,
                        response.statusCode,
                        duration
                    );
                },
                error: (error) => {
                    const duration = Date.now() - startTime;

                    this.logger.error(`Request failed: ${method} ${url}`, error.stack, {
                        type: 'request-error',
                        method,
                        url,
                        userId: user?.id,
                        duration: `${duration}ms`,
                        errorMessage: error.message,
                    });
                },
            })
        );
    }

    // Remove sensitive data from logs
    private sanitizeBody(body: any): any {
        if (!body) return undefined;

        const sanitized = { ...body };
        const sensitiveFields = ['password', 'token', 'secret', 'apiKey'];

        sensitiveFields.forEach(field => {
            if (sanitized[field]) {
                sanitized[field] = '***REDACTED***';
            }
        });

        return sanitized;
    }
}
