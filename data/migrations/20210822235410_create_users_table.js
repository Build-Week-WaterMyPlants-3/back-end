
exports.up = function(knex) {
  return knex.schema.createTable('users', tbl => {
    tbl.increments();
    tbl.string('username').notNullable().unique();
    tbl.string('password').notNullable();
  })  
  .createTable('plants', tbl => {
    tbl.increments();
    tbl.string('nickname').notNullable();
    tbl.integer('frequency').notNullable();
    tbl.string('species').notNullable();
    tbl.integer('userId').unsigned().notNullable().references('users.id');
  })
};
  
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('plants')
    .dropTableIfExists('users')
};
