import { Request } from 'express';
import { uniqBy, prop } from 'ramda';
import { CrudOptions, QueryParam } from '../';
import filters from './filters';
import relationExpressionFromArray from './relation-expression-from-array';

const buildFilter = (param: QueryParam, qb: any) => {
  const { ref } = param;
  const { filterFn, relation } = ref;

  // @ts-ignore
  const filter = filters[filterFn || 'eq'];

  const { method, args } = filter(param.ref, param.value);

  if (relation && !relation.isOneToOne()) {
    const subQuery = relation.ownerModelClass
      .relatedQuery(relation.name)
      .alias(relation.relatedModelClass.tableName);
    subQuery[method].apply(subQuery, args);

    qb.whereExists(subQuery.select(1));
  } else {
    qb[method].apply(qb, args);
  }
};

const buildJoins = (params: QueryParam[], qb: any) => {
  const relationsToJoin: any[] = [];

  params
    .filter((param) => !param.isSpecial)
    .forEach((param) => {
      const rel = param.ref.relation;
      if (rel && rel.isOneToOne()) {
        relationsToJoin.push(rel);
      }
    });

  uniqBy(prop('name'), relationsToJoin).forEach((rel) => {
    rel.join(qb, {
      joinOperation: 'leftJoin',
      relatedTableAlias: `${qb._modelClass.tableName}_rel_${rel.name}`,
    });
  });

  if (relationsToJoin.length) {
    qb.select(`${qb._modelClass.tableName}.*`);
  }
};

const buildFilters = (params: QueryParam[], qb: any) => {
  params.filter((param) => !param.isSpecial).forEach((param) => buildFilter(param, qb));
};

const buildOrderBy = (params: QueryParam[], qb: any) => {};

const buildEager = (options: CrudOptions, qb: any) => {
  const eager = options.eager?.index;

  if (eager) {
    const eagerQuery = relationExpressionFromArray(eager as string[]);
    qb.withGraphFetched(eagerQuery);
  }
};

const buildModifiers = (req: Request, options: CrudOptions, qb: any) => {
  const modifiers =
    typeof options.modifiers!.index === 'function'
      ? options.modifiers?.index(req)
      : options.modifiers?.index;

  modifiers?.forEach((modifier) =>
    Array.isArray(modifier) ? qb.modify(...modifier) : qb.modify(modifier)
  );

  if (modifiers?.length) {
    qb.select(`${qb._modelClass.tableName}.*`);
  }
};

const buildDistance = (params: QueryParam[], qb: any) => {
  const distanceParam = params.find(({ key }) => key === 'distance');
  const lngParam = params.find(({ key }) => key === 'lng');
  const latParam = params.find(({ key }) => key === 'lat');
  if (distanceParam && lngParam && latParam) {
    qb.having('distance', '<', distanceParam.value);
  }
};

const buildPage = (params: QueryParam[], options: CrudOptions, qb: any) => {
  const pageParam = params.find(({ key }) => key === 'page');
  if (options.pagination && pageParam?.value !== 'false') {
    const pageSizeParam = params.find(({ key }) => key === 'pageSize');
    const page = Number(pageParam?.value) - 1 || 0;
    const pageSize = pageSizeParam?.value || options.pagination.pageSize;
    qb.page(page, pageSize);
  }
};

const buildLimit = (params: QueryParam[], qb: any) => {
  const limitParam = params.find(({ key }) => key === 'limit');
  if (limitParam) {
    qb.limit(limitParam.value);
  }
};

const buildSortBy = (params: QueryParam[], qb: any) => {
  const sortParam = params.find(({ key }) => key === 'sortBy');
  if (sortParam) {
    const parts = sortParam.value.split(':');
    const [column, dir] = parts;
    qb.orderBy(column, dir);
  }
};

export default (req: Request, params: any, options: any, qb: any) => {
  buildJoins(params, qb);
  buildFilters(params, qb);
  buildOrderBy(params, qb);
  buildEager(options, qb);
  buildModifiers(req, options, qb);
  buildDistance(params, qb);
  buildPage(params, options, qb);
  buildLimit(params, qb);
  buildSortBy(params, qb);
  return qb;
};
