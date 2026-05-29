declare namespace Express {
  interface Request {
    userId?: string;
    userRole?: string;
    userEmail?: string;
    dto?: unknown;
  }
}
