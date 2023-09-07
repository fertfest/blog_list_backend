const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./utils/config');

const app = express();
const blogRouter = require('./controllers/blogs');
const userRouter = require('./controllers/users');
const middleware = require('./utils/middleware');
const { info } = require('./utils/logger');

mongoose.set('strictQuery', false);

info('connecting to', MONGO_URI);

mongoose.connect(MONGO_URI)
  .then(() => {
    info('connected to database...');
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);
app.use(middleware.unknownEndpoint);

module.exports = app;
