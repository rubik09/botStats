import { errors } from '@1win/cdp-backend-tools';
import { ArgumentsHost, Catch, ExceptionFilter, Logger, LoggerService } from '@nestjs/common';

const exceptionFilter = errors.exceptionFilter;
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger: LoggerService = new Logger(GlobalExceptionFilter.name);
  catch(exceptions: any, host: ArgumentsHost) {
    return exceptionFilter.catchHelper(exceptions, exceptionFilter.handleExceptionForHttp, this.logger, host);
  }
}
