import "express";

declare global {
  namespace Express {
    interface Request {
      accessInfo?: { allow_endpoint: string };
    }
  }
}

export {};
