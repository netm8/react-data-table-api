import { PropertyRef } from '..';

export default (ref: any, Model: any): PropertyRef => {
  const parts = ref.split('.');
  let property;
  let model;
  let relation;
  let fullColumnName;

  if (parts.length === 1) {
    property = parts[0];
    model = Model;
  } else if (parts.length === 2) {
    const relationName = parts[0];

    try {
      relation = Model.getRelation(relationName);
    } catch (e) {
      throw new Error('PropertyRef: uknown relation ' + relationName);
    }

    property = parts[1];
    model = relation.relatedModelClass;
  }

  const [columnName, filterFn] = property.split(':');
  const parsedColumnName = model.propertyNameToColumnName(columnName);

  if (relation && relation.isOneToOne()) {
    fullColumnName = `${relation.ownerModelClass.getTableName()}_rel_${
      relation.name
    }.${parsedColumnName}`;
  } else {
    fullColumnName = `${model.tableName}.${parsedColumnName}`;
  }

  return {
    ref,
    relation,
    property,
    columnName,
    fullColumnName,
    filterFn: filterFn || 'eq',
    model,
  };
};
