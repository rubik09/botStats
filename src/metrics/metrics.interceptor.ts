import { CallHandler, ExecutionContext, HttpException, Injectable, NestInterceptor } from '@nestjs/common';
import { Histogram, register } from 'prom-client';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { HTTP_REQUEST_DURATION_SECONDS } from './metrics.constant';
import { IMetricsRecordParams } from '../utils/interfaces';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly httpRequestDurationSeconds: Histogram<string>;

  constructor() {
    this.httpRequestDurationSeconds = new Histogram(HTTP_REQUEST_DURATION_SECONDS);
    register.registerMetric(this.httpRequestDurationSeconds);
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    const { method, route } = context.switchToHttp().getRequest();
    const routePath = route ? route.path : 'unknown';

    const metricsParams: IMetricsRecordParams = { context, method, route: routePath, startTime };

    return next.handle().pipe(
      tap(() => this.recordMetrics(metricsParams)),
      catchError((error) => {
        this.recordMetrics(metricsParams, error);
        return throwError(() => error);
      }),
    );
  }

  private recordMetrics({ context, method, route, startTime }: IMetricsRecordParams, error?: any): void {
    const responseTimeInMs = Date.now() - startTime;
    const { statusCode } =
      error instanceof HttpException
        ? { statusCode: error.getStatus() }
        : { statusCode: context.switchToHttp().getResponse().statusCode };

    this.httpRequestDurationSeconds.labels(method, route, statusCode.toString()).observe(responseTimeInMs / 1000);
  }
}
