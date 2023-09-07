const userRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('blogs', { likes: 0, user: 0 });

  response.json(users);
});

userRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body;
    if (!password || password.length < 3) {
      throw new Error();
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      name,
      passwordHash,
    });

    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch (e) {
    response.status(400).json({ error: 'user info is not valid.' });
  }
});

module.exports = userRouter;
