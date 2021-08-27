const request = require('supertest');
const server = require('./server');
const db = require('../data/dbConfig');

test('sanity', () => {
  expect(true).not.toBe(false)
});

describe('server.js', () => {
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  beforeEach(async () => {
    await db('users').truncate();
  });

  afterAll(async () => {
    await db.destroy();
  });

  describe('[POST] /register', () => {
    it('returns new user', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const newUser = await db('users').where('username', 'abcd').first()
      expect(newUser).toMatchObject({ username: 'abcd' });
    });
    it('returns an error when user/pass not provided', async() => {
      const noUserRes = await request(server).post('/api/auth/register').send({ password: '1234' });
      const noPassRes = await request(server).post('/api/auth/register').send({ username: 'abcd' });
      expect(noUserRes).toMatchObject({ status: 500 });
      expect(noPassRes).toMatchObject({ status: 500 });
    });
  });

  describe('[POST] /login', () => {
    it('returns welcome message on valid credentials', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const res = await request(server).post('/api/auth/login').send({ username: 'abcd', password: '1234' });
      expect(res.body.message).toMatch(/welcome back abcd/i)
    });
    it('returns error message on invalid credentials', async() => {
      await request(server).post('/api/auth/register').send({ username: 'abcd', password: '1234' });
      const res = await request(server).post('/api/auth/login').send({ username: 'abcd', password: 'wrong' });
      expect(res.body.message).toMatch(/invalid credentials/i)
    });
  });


});
