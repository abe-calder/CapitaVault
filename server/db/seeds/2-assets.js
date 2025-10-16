/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  await knex('assets').insert([
    {id: 1, ticker: 'BTC', name: 'Bitcoin', shares: 1, user_id: 1, cost: '2000NZD'},
  ]);
};
