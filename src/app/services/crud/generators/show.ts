import { CrudOptions } from '../index';
import { Request, Response, NextFunction } from 'express';
import { NOT_FOUND, OK, INTERNAL_SERVER_ERROR } from 'http-status-codes';
import relationExpressionFromArray from '../utils/relation-expression-from-array';

export default (Model: any, options: CrudOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { params } = req;
    const { query, adapters, eager, modifiers } = options;

    const qb = Model.query();

    if (eager?.show) {
      const relationExpression: string = relationExpressionFromArray(
        typeof eager.show === 'function' ? eager.show(req) : eager.show
      );

      qb.withGraphFetched(relationExpression);
    }

    if (modifiers?.show) {
      qb.select(`${Model.tableName}.*`);
      // @ts-ignore
      modifiers.show.forEach((modifier) => {
        qb.modify(modifier);
      });
    }

    const response = await qb
      .where(query?.show?.columnName, params[query?.show?.paramName as string])
      .first();

    if (!response) {
      return next({ status: NOT_FOUND, message: 'Entity not found' });
    }

    return adapters?.response(OK, response, req, res, next);
  } catch (e) {
    console.log(e);
    if (options.debug && process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    return next({
      status: INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};
