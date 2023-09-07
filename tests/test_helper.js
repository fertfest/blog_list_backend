const Blog = require('../models/blog');
const User = require('../models/user');

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

const initialUsers = [
  {
    username: 'chen12',
    name: 'cyy1',
    password: '1234',
  },
  {
    username: 'fertfest',
    name: 'cy',
    password: '123456',
  },
];

const getUsers = async () => {
  const users = await User.find({});

  return users;
};

module.exports = {
  initialBlogs,
  getBlogs,
  initialUsers,
  getUsers,
};
