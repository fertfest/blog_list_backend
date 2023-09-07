const blogRouter = require('express').Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { blogs: 0 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  console.log(request.body);
  if (!(request.body.title) || !(request.body.url)) {
    response.status(400).json({ error: 'title or url is empty' });
    return;
  }

  if (!request.body.likes) {
    request.body.likes = 0;
  }

  const token = request.headers.authorization.substring(7);

  const decoded = jwt.verify(token, process.env.SECRET);

  if (!decoded.id) {
    response.status(400).json({ error: 'token is invalid!' });
  }

  const user = await User.findById(decoded.id);
  const blog = new Blog({ ...request.body, user: user.id });
  const savedBlog = await blog.save();
  await User.findByIdAndUpdate(user, {
    blogs: user.blogs ? user.blogs.concat(savedBlog.id) : [savedBlog.id],
  });

  response.status(201).json(savedBlog);
});

blogRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  console.log(id);
  try {
    await Blog.findByIdAndRemove(id);
    response.status(204).end();
  } catch (exception) {
    response.status(404).end();
  }
});

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const newData = request.body;
  console.log(id);
  console.log(newData);

  try {
    await Blog.findByIdAndUpdate(id, newData);
    response.status(200).end();
  } catch (exception) {
    response.status(404).end();
  }
});

module.exports = blogRouter;
