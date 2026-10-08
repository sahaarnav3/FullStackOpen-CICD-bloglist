const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there is initially one user in the db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 11);
    const user = new User({ username: 'root', name: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const userAtStart = await helper.usersInDb();

    const newUser = {
      username: 'exusername',
      name: 'Example Name',
      password: 'topsekret',
    };
    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert.strictEqual(userAtStart.length + 1, usersAtEnd.length);

    const usernames = usersAtEnd.map((u) => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation failes with proper statuscode and message if username already taken', async () => {
    const userAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root',
      name: 'root',
      password: 'topsekret',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtEnd.length, userAtStart.length);
  });

  test('creation failes with proper statuscode and message if username is empty', async () => {
    const userAtStart = await helper.usersInDb();
    const newUser = {
      username: '',
      name: 'root',
      password: 'topsekret',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` is required.'
      )
    );
    assert.strictEqual(usersAtEnd.length, userAtStart.length);
  });

  test('creation failes with proper statuscode and message if username length is less then 3', async () => {
    const userAtStart = await helper.usersInDb();
    const newUser = {
      username: 'ro',
      name: 'root',
      password: 'topsekret',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        'User validation failed: username: Path `username` (`ro`, length 2) is shorter than the minimum allowed length (3).'
      )
    );
    assert.strictEqual(usersAtEnd.length, userAtStart.length);
  });

  test('creation failes with proper statuscode and message if password is empty', async () => {
    const userAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root2',
      name: 'root two',
      password: '',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "Either password is missing or doesn't have minimum 3 characters"
      )
    );
    assert.strictEqual(usersAtEnd.length, userAtStart.length);
  });

  test('creation failes with proper statuscode and message if password is less than 3 characters', async () => {
    const userAtStart = await helper.usersInDb();
    const newUser = {
      username: 'root2',
      name: 'root two',
      password: 'ro',
    };
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    assert(
      result.body.error.includes(
        "Either password is missing or doesn't have minimum 3 characters"
      )
    );
    assert.strictEqual(usersAtEnd.length, userAtStart.length);
  });
});

after(async () => {
  await mongoose.connection.close();
});
