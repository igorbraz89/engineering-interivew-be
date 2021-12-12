import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
    returnTo: string | string[] | ParsedQs | ParsedQs[];
  }
}
