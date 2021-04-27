import { CrudOptions } from '../index';
import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND, INTERNAL_SERVER_ERROR, OK } from 'http-status-codes';
import relationExpressionFromArray from '../utils/relation-expression-from-array';

export default (Model: any, options: CrudOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params } = req;
    const { query, adapters } = options;

    const qb = Model.query();

    const response = await qb
      .where(query?.delete?.columnName, params[query?.delete?.paramName as string])
      .delete();

    if (!response) {
      return next({ status: NOT_FOUND, message: 'Entity not found' });
    }

    return adapters?.response(OK, response, req, res, next);
  } catch (e) {
    if (options.debug && process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    return next({
      status: INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};
