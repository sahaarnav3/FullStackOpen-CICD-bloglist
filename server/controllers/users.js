const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body;

  if (!(password && password.length >= 3))
    return res.status(400).json({
      error: "Either password is missing or doesn't have minimum 3 characters",
    });

  const saltRounds = 11;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });

  const savedUser = await user.save();
  return res.status(201).json(savedUser);
});

userRouter.get('/', async (req, res) => {
  const users = await User.find({})
    .select('username name id')
    .populate('blogs', { url: 1, title: 1, author: 1 });
  return res.json(users);
});

userRouter.get('/:id', async (req, res) => {
  const userDetails = await User.findById(req.params.id)
    .select('name id')
    .populate('blogs', { title: 1 });
    return res.json(userDetails)
});

module.exports = userRouter;
