import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      getLocale(): string;
      setLocale(locale: string): void;
      __(phrase: string, ...args: any[]): string;
    }
  }
} 