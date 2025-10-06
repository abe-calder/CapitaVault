/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('assets', (table) => {
    table.increments('id')
    table.string('ticker')
    table.string('name')
    table.integer('shares')
    table.string('cost')
    table.integer('user_id').references('users.id')
  })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('assets')
};

