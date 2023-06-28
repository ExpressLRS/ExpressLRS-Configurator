export type QueryOptions = {
  rows?: number;
  order?: 'asc' | 'desc';
  fields: string[];
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface LoggerService {
  log(message: any, context?: Record<string, unknown>): void;

  error(message: any, trace?: string, context?: Record<string, unknown>): void;

  warn(message: any, context?: Record<string, unknown>): void;

  debug?(message: any, context?: Record<string, unknown>): void;

  verbose?(message: any, context?: Record<string, unknown>): void;

  query(options?: QueryOptions): Promise<any>;
}
