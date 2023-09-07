const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: 'good good',
    author: 'cy',
    url: 'localhost:80',
    likes: 300,
  },
  {
    title: 'bad bad',
    author: 'cyy',
    url: 'localhost:79',
    likes: 288,
  },
];

const getBlogs = async () => {
  const blogs = await Blog.find({});

  return blogs;
};

module.exports = {
  initialBlogs,
  getBlogs,
};
