import { CrudOptions } from '..';
import { Request, Response, NextFunction } from 'express';
import relationExpressionFromArray from '../utils/relation-expression-from-array';
import { BAD_REQUEST, CREATED } from 'http-status-codes';

export default (Model: any, options: CrudOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { body } = req;
    const { adapters, query, effects } = options;
    const qb = Model.query();

    if (query?.create?.allowGraph) {
      const relationExpression: string = relationExpressionFromArray(query.create.allowGraph);
      qb.allowGraph(relationExpression);
    }

    qb.insertGraphAndFetch(body, query?.create?.options);

    const response = await qb;

    if (effects.create) {
      effects.create.forEach(async (fn: any) => {
        try {
          await fn(req, res, next, response);
        } catch (e) {
          throw e;
        }
      });
    }

    return adapters?.response(CREATED, response, req, res, next);
  } catch (e) {
    if (options.debug && process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    return next({ status: BAD_REQUEST, message: 'Internal server error' });
  }
};
