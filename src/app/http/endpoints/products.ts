import Product from '@/models/Product';
import crudify from '@/services/crud';

const crud = crudify(Product, {
  debug: true,
  eager: {
    index: [],
    show: [],
  },
  query: {
    show: {
      columnName: 'slug',
    },
  },
});

export default {
  index: crud.index,
  show: crud.show,
  create: crud.create,
  routes: crud.registerCrudRoutes,
};
