const db = require('../../data/dbConfig');

module.exports = {
  find,
  findBy,
  findById,
  addPlant,
  updatePlant,
  deletePlant,
}

async function find() {
  return await db('plants as p')
    .select('p.id', 'p.nickname', 'p.frequency', 'p.species');
};

async function findBy(id) {
  return await db('plants as p')
    .join('users as u', 'u.id', 'p.userId')
    .select('p.id', 'p.nickname', 'p.frequency', 'p.species')
    .where('p.userId', id);
};

async function findById(id) {
  return await db('plants as p')
    .select('p.id', 'p.nickname', 'p.frequency', 'p.species')
    .where('p.id', id)
    .first();
};

async function addPlant(plantData) {
  return await db('plants').insert(plantData);
};

async function updatePlant(id, updatedPlant) {
  return await db('plants')
    .where('id', id)
    .update(updatedPlant, '*');
};

function deletePlant(id) {
  return db('plants')
    .where('id', id)
    .del();
};
