import { PropertyRef } from '..';

const basicWhere = (ref: PropertyRef, operator: string, value: string | null) => ({
  method: 'where',
  args: [ref.fullColumnName, operator, value],
});

const eq = (ref: PropertyRef, value: string) => basicWhere(ref, '=', value);
const neq = (ref: PropertyRef, value: string) => basicWhere(ref, '<>', value);

const inSet = (ref: PropertyRef, value: string) => ({
  method: 'whereIn',
  args: [ref.fullColumnName, value.split(',')],
});

const like = (ref: PropertyRef, value: string) => basicWhere(ref, 'LIKE', `%${value}%`);

const lt = (ref: PropertyRef, value: string) => basicWhere(ref, '<', value);
const gt = (ref: PropertyRef, value: string) => basicWhere(ref, '>', value);
const lte = (ref: PropertyRef, value: string) => basicWhere(ref, '<=', value);
const gte = (ref: PropertyRef, value: string) => basicWhere(ref, '>=', value);

const isNull = (ref: PropertyRef, value: string) => basicWhere(ref, 'is', null);

const between = (ref: PropertyRef, value: string) => ({
  method: 'whereBetween',
  args: [ref.fullColumnName, value.split(',')],
});

export default {
  eq,
  like,
  neq,
  in: inSet,
  lt,
  gt,
  lte,
  gte,
  isNull,
  between,
};
