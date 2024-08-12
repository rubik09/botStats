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
    const { method, route } = context.switchToHttp().getRequest();
    const routePath = route ? route.path : 'unknown';

    return next.handle().pipe(
      tap(() => this.recordMetrics(context, method, routePath, now)),
      catchError((error) => {
        this.recordMetrics(context, method, routePath, now, error);
        return throwError(() => error);
      }),
    );
  }

  private recordMetrics(
    context: ExecutionContext,
    method: string,
    route: string,
    startTime: number,
    error?: any,
  ): void {
    const responseTimeInMs = Date.now() - startTime;
    const { statusCode } =
      error instanceof HttpException
        ? { statusCode: error.getStatus() }
        : { statusCode: context.switchToHttp().getResponse().statusCode };

    this.httpRequestDurationSeconds.labels(method, route, statusCode.toString()).observe(responseTimeInMs / 1000);
  }
}
