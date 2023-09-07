const express = require('express');

const blogRouter = express.Router();
const Blog = require('../models/blog');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
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
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
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
