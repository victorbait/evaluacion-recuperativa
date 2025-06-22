import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminUsername?: string;
    lastActivity?: number;
  }
}

declare module 'express' {
  interface Request {
    session: any;
  }
} 