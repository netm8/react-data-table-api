import { NextFunction } from 'express'
import { InsertGraphOptions, UpsertGraphOptions } from 'objection'

export type RelationResolver = (req: Request) => string[]
export type ModifierResolver = (req: Request) => (string | string[])[]
export type Relation = string[] | RelationResolver
export type Modifier = (string | string[])[] | ModifierResolver
export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void

export type CrudMethods<T> = {
  index?: T
  show?: T
  create?: T
  delete?: T
}

export type PaginationOptions = {
  pageSize?: number
  pageParamName?: string
  pageSizeParamName?: string
}

export type Adapters = {
  response: (
    status: number,
    payload: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
  paginated: (
    status: number,
    payload: any,
    pagination: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) => void
  error: (
    status: number,
    req: Request,
    res: Response,
    e: any,
    next: NextFunction
  ) => void
}

export type QueryOptions = {
  show?: {
    paramName?: string
    columnName?: string
  }
  create?: {
    allowGraph?: string[]
    options?: InsertGraphOptions
  }
  update?: {
    allowUpsert?: string[]
    options?: UpsertGraphOptions
    paramName?: string
    columnName?: string
  }
  delete?: {
    paramName?: string
    columnName?: string
  }
}

export type CrudOptions = {
  debug?: boolean
  middlewares?: any
  eager?: CrudMethods<Relation>
  joins?: CrudMethods<Relation>
  modifiers?: CrudMethods<Modifier>
  pagination?: PaginationOptions | false
  adapters?: Adapters
  query?: QueryOptions
}

export type PropertyRef = {
  ref: string
  relation: any
  property: string
  columnName: string
  fullColumnName: string
  filterFn: string
  model: any
}

export type QueryParam = {
  key: string
  value: string
  isSpecial: boolean
  ref: PropertyRef
}
