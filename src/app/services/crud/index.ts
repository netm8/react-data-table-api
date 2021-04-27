import { Request, Response, NextFunction, Router } from 'express';
import { InsertGraphOptions, UpsertGraphOptions } from 'objection';
import { mergeDeepRight } from 'ramda';

import { response, paginated, error } from './adapters';

import createIndexEndpoint from './generators/list';
import createShowEndpoint from './generators/show';
import createCreateEndpoint from './generators/create';
import createUpdateEndpoint from './generators/update';
import createRemoveEndpoint from './generators/remove';

export type RelationResolver = (req: Request) => string[];
export type ModifierResolver = (req: Request) => (string | string[])[];
export type Relation = string[] | RelationResolver;
export type Modifier = (string | string[])[] | ModifierResolver;
export type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export type CrudMethods<T> = {
  index?: T;
  show?: T;
  create?: T;
  delete?: T;
};

export type PaginationOptions = {
  pageSize?: number;
  pageParamName?: string;
  pageSizeParamName?: string;
};

export type Adapters = {
  response: (status: number, payload: any, req: Request, res: Response, next: NextFunction) => any;
  paginated: (
    status: number,
    payload: any,
    pagination: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => any;
  error: (status: number, req: Request, res: Response, e: any, next: NextFunction) => any;
};

export type QueryOptions = {
  show?: {
    paramName?: string;
    columnName?: string;
  };
  create?: {
    allowGraph?: string[];
    options?: InsertGraphOptions;
  };
  update?: {
    allowUpsert?: string[];
    options?: UpsertGraphOptions;
    paramName?: string;
    columnName?: string;
  };
  delete?: {
    paramName?: string;
    columnName?: string;
  };
};

export type CrudOptions = {
  debug?: boolean;
  middlewares?: any;
  effects?: any;
  eager?: CrudMethods<Relation>;
  joins?: CrudMethods<Relation>;
  modifiers?: CrudMethods<Modifier>;
  pagination?: PaginationOptions | false;
  adapters?: Adapters;
  query?: QueryOptions;
};

export type PropertyRef = {
  ref: string;
  relation: any;
  property: string;
  columnName: string;
  fullColumnName: string;
  filterFn: string;
  model: any;
};

export type QueryParam = {
  key: string;
  value: string;
  isSpecial: boolean;
  ref: PropertyRef;
};

const initialOptions = {
  debug: false,
  middlewares: {
    index: [],
    show: [],
    update: [],
    create: [],
    delete: [],
  },
  effects: {
    index: [],
    show: [],
    update: [],
    create: [],
    delete: [],
  },
  eager: {
    index: [],
    show: [],
    create: [],
    delete: [],
  },
  joins: {
    index: [],
    show: [],
    create: [],
    delete: [],
  },
  modifiers: {
    index: [],
    show: [],
    create: [],
    delete: [],
  },
  pagination: {
    pageSize: 10,
    pageParamName: 'page',
    pageSizeParamName: 'pageSize',
  },
  adapters: {
    response,
    paginated,
    error,
  },
  query: {
    show: {
      paramName: 'id',
      columnName: 'id',
    },
    create: {
      allowGraph: [],
      options: {},
    },
    update: {
      allowUpsert: [],
      options: {},
      paramName: 'id',
      columnName: 'id',
    },
    delete: {
      paramName: 'id',
      columnName: 'id',
    },
  },
};

export default (Model: any, userOptions: CrudOptions) => {
  const options = mergeDeepRight(initialOptions, userOptions) as CrudOptions;

  const index = createIndexEndpoint(Model, options);
  const show = createShowEndpoint(Model, options);
  const update = createUpdateEndpoint(Model, options);
  const create = createCreateEndpoint(Model, options);
  const remove = createRemoveEndpoint(Model, options);

  const registerCrudRoutes = () => {
    const router = Router();
    const {
      middlewares: {
        index: indexMiddlewares,
        show: showMiddlewares,
        create: createMiddlewares,
        update: updateMiddlewares,
        delete: deleteMiddlewares,
      },
    } = options;

    router.get('/', ...indexMiddlewares, index);
    router.get(`/:${options.query?.show?.paramName}`, ...showMiddlewares, show);
    router.post('/', ...createMiddlewares, create);
    router.patch(`/:${options.query?.update?.paramName}`, ...updateMiddlewares, update);
    router.delete(`/:${options.query?.delete?.paramName}`, ...deleteMiddlewares, remove);

    return router;
  };

  return { index, show, update, create, remove, registerCrudRoutes };
};
