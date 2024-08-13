import { HistogramConfiguration } from 'prom-client';

export const HTTP_REQUEST_DURATION_SECONDS: HistogramConfiguration<string> = {
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.5, 1, 3, 5, 10],
};
