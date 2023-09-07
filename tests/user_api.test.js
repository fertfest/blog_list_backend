const supertest = require('supertest');
const { mongoose } = require('mongoose');
const User = require('../models/user');
const { initialUsers, getUsers } = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});

  const promises = initialUsers.map((user) => new User(user).save());
  await Promise.all(promises);
});

describe('add a user', () => {
  test('fail with status code 404 if input is invalid', async () => {
    // no username
    let user = {
      password: 'fsfs',
      name: 'fsfs',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400);

    // no password
    user = {
      username: 'chen11',
      name: 'fsfs',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400);

    // length of username is less than 3 
    user = {
      username: 'ch',
      password: 'fzfzsf',
      name: 'fsfs',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400);

    // length of password is less than 3
    user = {
      username: 'chen1',
      password: 'fz',
      name: 'fsfs',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400);

    // username conflicts with some user in database 
    user = {
      username: 'fertfest',
      password: 'fzzz',
      name: 'fsfs',
    };
    await api
      .post('/api/users')
      .send(user)
      .expect('Content-Type', /json/)
      .expect(400);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
