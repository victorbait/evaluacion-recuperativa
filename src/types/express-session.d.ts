import 'express-session';

declare module 'express-session' {
  interface SessionData {
    isAdmin?: boolean;
    adminUsername?: string;
  }
}

declare module 'express' {
  interface Request {
    session: any;
  }
} 