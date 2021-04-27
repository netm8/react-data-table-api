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
    const { body } = req;
    const { query, adapters } = options;

    const qb = Model.query();

    if (query?.update?.allowUpsert) {
      const relationExpression: string = relationExpressionFromArray(query.update.allowUpsert);

      qb.allowGraph(relationExpression);
    } else {
      qb.allowGraph();
    }

    const response = await qb.upsertGraphAndFetch(body, query?.update?.options);

    if (!response) {
      return next({ status: NOT_FOUND, message: 'Entity not found' });
    }

    return adapters?.response(OK, response, req, res, next);
  } catch (e) {
    console.log(e);
    return next({
      status: INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
};
