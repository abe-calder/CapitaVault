/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {

  await knex('users').insert([
    {
      id: 1,
      auth0Id: 'google-oauth2|113371660698602666717',
      name: 'Abe',
      email: 'abecalder@gmail.com',
      username: 'AbeC',
    },
  ])
};

