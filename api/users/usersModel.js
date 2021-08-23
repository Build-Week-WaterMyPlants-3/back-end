const db = require('../../data/dbConfig');

module.exports = {
  addUser,
  editUser,
  find,
  findBy,
  findById,
}

async function addUser(user) {
  return await db('users').insert(user);
};

async function editUser(id, updatedUser) {
  return await db('users').where({ id }).update(updatedUser, '*');
};

async function find() {
  return await db('users');
};

async function findBy(filter) {
  return await db('users').where(filter).first();
};

async function findById(id) {
  return await db('users').where({ id }).first();
};

