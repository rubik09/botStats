import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Histogram, register } from 'prom-client';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HTTP_REQUEST_DURATION_SECONDS } from './metrics.constant';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestDurationSeconds: Histogram<string>;

  constructor() {
    this.httpRequestDurationSeconds = new Histogram(HTTP_REQUEST_DURATION_SECONDS);
    register.registerMetric(this.httpRequestDurationSeconds);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const route = request.route ? request.route.path : 'unknown';

    return next.handle().pipe(
      tap(() => {
        const responseTimeInMs = Date.now() - now;
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.httpRequestDurationSeconds.labels(method, route, statusCode.toString()).observe(responseTimeInMs / 1000);
      }),
      catchError((error) => {
        const responseTimeInMs = Date.now() - now;
        const statusCode = error instanceof HttpException ? error.getStatus() : 500;
        this.httpRequestDurationSeconds.labels(method, route, statusCode.toString()).observe(responseTimeInMs / 1000);
        return throwError(() => error);
      }),
    );
  }
}
