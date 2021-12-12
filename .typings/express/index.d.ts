declare namespace Express {
  interface Request {
    accessControl: any;
    db: any;
    user: any;
  };
}
