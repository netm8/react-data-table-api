exports.up = function (knex) {
  return Promise.resolve(
    knex.schema.createTableIfNotExists('products', (t) => {
      t.increments();
      t.string('name', 128);
      t.string('slug', 196);
      t.string('ean', 13);
      t.text('description', 'longtext');
      t.integer('quantity').unsigned();
      t.decimal('price', 10, 2);
      t.float('min_price');
      t.enum('currency', ['PLN']);
      t.enum('condition', ['new', 'used']);
      t.bool('invoice');
      t.bool('price_proposals');
      t.enum('offer_type', ['auction', 'detail', 'put_offer']);
    })
  );
};

exports.down = function (knex) {
  return Promise.resolve(knex.schema.dropTableIfExists('products'));
};
