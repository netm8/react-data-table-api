import { Response, Request, NextFunction } from 'express';

export const response = (
  status: number,
  payload: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(status).json({
    status,
    payload,
  });
};

export const paginated = (
  status: any,
  payload: any,
  pagination: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res.status(status).json({
    status,
    pagination,
    payload,
  });
};

export const error = (
  status: number,
  req: Request,
  res: Response,
  e: any,
  next: NextFunction
) => {};
