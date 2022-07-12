import { Request, Response, NextFunction } from 'express';

const serviceErrorToStatusCode = {
  unauthorized: 401,
  conflict: 409,
  bad_request: 400
};

export function unauthorizedError() {
  return { type: "unauthorized" };
}

export function conflictError() {
  return { type: "conflict" };
}

export function badRequest() {
  return { type: "bad_request" };
}

export default function handleErrorsMiddleware(err , req: Request, res: Response, next: NextFunction) {
  if (err.type) {
    return res.sendStatus(serviceErrorToStatusCode[err.type]);
  }
  res.sendStatus(500);
}
