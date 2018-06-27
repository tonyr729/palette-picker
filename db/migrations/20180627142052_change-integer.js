
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.alterTable('palettes', function(table) {
      table.string('color1').alter();
      table.string('color2').alter();
      table.string('color3').alter();
      table.string('color4').alter();
      table.string('color5').alter();
    })
  ])
};


exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('palettes'),
    knex.schema.dropTable('projects')
  ]);
};