import { NextFunction, Request, Response } from 'express';
import { CrudOptions, PaginationOptions, QueryParam } from '../index';
import parseQueryParams from '../utils/parse-query-params';
import findQueryBuilder from '../utils/find-query-builder';
import { OK } from 'http-status-codes';

export default (Model: any, options: CrudOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const queryParams: QueryParam[] = parseQueryParams(req.query, Model);
    const qb = Model.query();

    let paginationInfoObject = {
      page: Number(req.query[(options.pagination as PaginationOptions).pageParamName!]) || 1,
      pageSize:
        Number(req.query[(options.pagination as PaginationOptions).pageSizeParamName!]) ||
        (options.pagination as PaginationOptions).pageSize!,
      total: 0,
      pagesCount: 0,
    };

    const response = await findQueryBuilder(req, queryParams, options, qb);

    if (response.total) {
      paginationInfoObject = {
        ...paginationInfoObject,
        total: response.total,
        pagesCount: Math.ceil(response.total / paginationInfoObject.pageSize),
      };
    }

    return response.results
      ? options.adapters!.paginated(OK, response.results, paginationInfoObject, req, res, next)
      : options.adapters!.response(OK, response, req, res, next);
  } catch (e) {
    if (options.debug && process.env.NODE_ENV === 'development') {
      console.error(e);
    }
    return next({
      status: OK,
      message: 'Internal server error.',
    });
  }
};
