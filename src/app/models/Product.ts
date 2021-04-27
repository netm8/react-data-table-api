import Model from './Model';

export interface ProductModel {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  currency: string;
  offer_type: string;
}

class Product extends Model implements ProductModel {
  public id!: number;
  public name!: string;
  public description!: string;
  public quantity!: number;
  public price!: number;
  public currency!: string;
  public offer_type!: string;

  public static tableName: string = 'products';

  public static fillable: string[] = [
    'name',
    'description',
    'quantity',
    'price',
    'currency',
    'offer_type',
    'price_proposals',
  ];

  public static filters = [
    { key: 'name' },
    { key: 'query', column: 'name' },
    { key: 'id' },
    { key: 'price' },
    { key: 'offer_type' },
    { key: 'condition' },
  ];

  public static relationMappings = {};
}

export default Product;
