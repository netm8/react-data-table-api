import { QueryParam } from '../index';
import createPropertyRef from './create-property-ref';

const SPECIAL_PARAMS = Object.freeze({
  page: 'page',
  sortBy: 'orderBy',
  pageSize: 'pageSize',
  distance: 'distance',
  lng: 'lng',
  lat: 'lat',
  limit: 'limit',
});

export default (params: any, Model: any): QueryParam[] => {
  const keys: string[] = Object.keys(params);
  const filters = Model.filters;

  return keys
    .filter(
      (key) =>
        key in SPECIAL_PARAMS ||
        filters.find(({ key: filterKey }: { key: any }) => key.split(':')[0] === filterKey)
    )
    .reduce<QueryParam[]>((acc, key) => {
      const [columnName, filterFn] = key.split(':');

      const filter = filters.find(({ key: filterKey }: { key: any }) => filterKey === columnName);
      const parsedKey = `${filter?.column || columnName}${filterFn ? `:${filterFn}` : ''}`;

      return [
        ...acc,
        {
          key: parsedKey,
          value: params[key],
          isSpecial: SPECIAL_PARAMS.hasOwnProperty(columnName),
          ref: createPropertyRef(parsedKey, Model),
        },
      ];
    }, []);
};
