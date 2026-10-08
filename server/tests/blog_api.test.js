const assert = require('node:assert');
const { test, after, beforeEach, describe } = require('node:test');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const api = supertest(app);
let token;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const user = new User({ username: 'root', passwordHash: 'topSekret' });
  const savedUser = await user.save();

  const userForToken = { username: savedUser.username, id: savedUser._id };
  token = jwt.sign(userForToken, process.env.SECRET);

  const blogsWithUser = helper.initialBlogs.map((blog) => ({
    ...blog,
    user: savedUser._id,
  }));
  await Blog.insertMany(blogsWithUser);
});

describe('Fetching and Adding of blogs', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs');
    assert.ok(
      'id' in response.body[0],
      'Response body should contain "id" key'
    );
    assert.strictEqual(
      '_id' in response.body[0],
      false,
      'Expected "_id" to be removed'
    );
  });

  test('a valid blog can be added', async () => {
    const newBlog = helper.newBlog;
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map((blog) => blog.title);
    assert(titles.includes('Type wars'));
  });

  test('missing like property will default to zero', async () => {
    const blogWithoutLike = helper.blogWithoutLike;
    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLike)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    assert(Object.keys(response.body).includes('likes'));
    assert.strictEqual(response.body.likes, 0);
  });

  test('checking bad request if title or url is missing', async () => {
    const blogWithoutTitle = helper.blogWithoutTitle;
    const blogWithoutUrl = helper.blogWithoutUrl;
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutTitle)
      .expect(400);
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutUrl)
      .expect(400);
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('fails with status code 401 if token is not provided', async () => {
    const newBlog = helper.newBlog;

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.error, 'Unauthorized');

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });
});

describe('deletion of a blog', () => {
  test('succeed with status code 204 if id is valid and user is owner', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);

    const blogsAtEnd = await helper.blogsInDb();
    const contents = blogsAtEnd.map((blog) => blog.title);
    assert(!contents.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
  });

  test('fail with 401 if token is missing', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    const contents = blogsAtEnd.map((blog) => blog.title);
    assert(contents.includes(blogToDelete.title));

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('deletion fails with 401 if a user tries to delete a blog they do not own', async () => {
    const otherUser = new User({ username: 'hacker', passwordHash: '12345' });
    const savedOtherUser = await otherUser.save();

    const otherToken = jwt.sign(
      { username: savedOtherUser.username, id: savedOtherUser._id },
      process.env.SECRET
    );

    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(401);

    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  test('deletion fails with 401 if the blog id does not exist', async () => {
    const validNonexistingId = '5a422ba71b54a676234d17fb';

    await api
      .delete(`/api/blogs/${validNonexistingId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(401);
  });
});

describe('updation of a blog', () => {
  test('succeed with status code 200 if format is valid', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0];
    const newLikesValue = { likes: 27 };

    const updatedBlog = await api
      .put(`/api/blogs/${blogToDelete.id}`)
      .send(newLikesValue)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(updatedBlog.body.likes, newLikesValue.likes);
  });
});

after(async () => {
  await mongoose.connection.close();
});
