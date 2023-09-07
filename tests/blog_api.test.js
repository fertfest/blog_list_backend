const supertest = require('supertest');
const { mongoose } = require('mongoose');
const Blog = require('../models/blog');
const { initialBlogs, getBlogs } = require('./test_helper');
const app = require('../app');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});

  const promises = initialBlogs.map((blog) => new Blog(blog).save());
  await Promise.all(promises);
});

describe('view all blogs', () => {
  test('blogs are returned as json', async () => {
    await api.get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all blogs are returned', async () => {
    const startBlogs = await (await api.get('/api/blogs')).body;

    expect(startBlogs).toHaveLength(initialBlogs.length);
  });

  test('all blogs has unique identifier id', async () => {
    const startBlogs = (await api.get('/api/blogs')).body;

    startBlogs.forEach((blog) => {
      expect(blog.id).toBeDefined();
    });
  });
});

test('new blog can be saved to database', async () => {
  const newBlog = {
    title: 'new blog',
    author: 'unnamed',
    url: 'hhfsf.com',
    likes: 8888,
  };

  await api.post('/api/blogs').send(newBlog);
  const endBlogs = await Blog.find({});

  expect(endBlogs).toHaveLength(initialBlogs.length + 1);
});

describe('add a new blog', () => {
  test('new blog with no likes property will have likes of value 0', async () => {
    const newBlog = {
      title: 'new blog',
      author: 'unnamed',
      url: 'hhfsf.com',
    };

    const response = await api.post('/api/blogs').send(newBlog);
    const { id } = response._body;

    const newBlogInDB = await Blog.findById(id);
    expect(newBlogInDB.likes).toBe(0);
  });

  test('new blog without title or url will be rejected', async () => {
    const noTitle = {
      author: 'sfs',
      url: 'fzfzfz',
      likes: 20,
    };

    const noUrl = {
      author: 'sfssf',
      title: 'fsfsz',
      likes: 30,
    };

    await api
      .post('/api/blogs')
      .send(noTitle)
      .expect(400);

    await api
      .post('/api/blogs')
      .send(noUrl)
      .expect(400);
  });
});

describe('deletion of a blog', () => {
  test('succeed with status coded 204 if id is valid', async () => {
    const blogsAtStart = await getBlogs();
    const idToBeDeleted = blogsAtStart[0].id;

    await api
      .delete(`/api/blogs/${idToBeDeleted}`)
      .expect(204);
    const blogsAtEnd = await getBlogs();
    const ids = blogsAtEnd.map((blog) => blog.id);

    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);
    expect(ids).not.toContain(idToBeDeleted);
  });

  test('fail with status code 404 if id is invalid', async () => {
    const blogsAtStart = await getBlogs();
    const idToBeDeleted = '411001231414141';

    await api
      .delete(`/api/blogs/${idToBeDeleted}`)
      .expect(404);

    const blogsAtEnd = await getBlogs();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);
  }, 10000);
});

describe('change info of some blog', () => {
  test('succeed with 200', async () => {
    const blogsAtStart = await getBlogs();
    const { id } = blogsAtStart[0];

    const newData = {
      likes: 30099,
    };

    await api.put(`/api/blogs/${id}`)
      .send(newData)
      .expect(200);

    const blogAltered = await Blog.findById(id);
    console.log(blogAltered);
    expect(blogAltered.likes).toBe(newData.likes);
  });

  test('fail with 404', async () => {
    const id = 'fsfsfsfsf';

    const newData = {
      likes: 30099,
    };
    api.put(`/api/blogs/${id}`)
      .send(newData)
      .expect(404);
  }, 10000);
});

afterAll(async () => {
  await mongoose.connection.close();
});
