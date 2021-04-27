const knex = require('knex');
const faker = require('faker');

faker.locale = 'pl';

const createFakeProducts = (length) =>
  Array.from({ length }).map((_, idx) => {
    const productName = faker.commerce.productName();

    return {
      id: idx + 1,
      name: productName,
      slug: faker.helpers.slugify(productName).toLowerCase(),
      ean: '0000000000000',
      description: faker.lorem.paragraphs(),
      quantity: faker.random.number(1200),
      price: faker.commerce.price(10, 1000),
      currency: 'PLN',
      condition: faker.random.arrayElement(['new', 'used']),
      invoice: faker.random.arrayElement([1, 0]),
      offer_type: faker.random.arrayElement(['auction', 'detail']),
    };
  });

exports.seed = (knex) => {
  return knex('products')
    .del()
    .then(async () => {
      return knex('products').insert(createFakeProducts(5000));
    });
};
