const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const restricted = require('../middleware/restricted');
const Users = require('./usersModel');
const { jwtSecret } = require('../config/secret');
const { uniqueName, checkUserExists } = require('../middleware/middleware');

router.get('/', restricted, async (req, res, next) => {
  try {
    const userData = await Users.find();
    res.status(200).json(userData);
  } catch (err) {
    next(err);
  };
});

router.post('/register', uniqueName, async (req, res, next) => {
  const newUser = req.body;
  const hash = bcrypt.hashSync(newUser.password, 8);
  newUser.password = hash;

  try {
    const registeredUser = await Users.addUser(newUser);
    res.status(201).json(registeredUser);
  } catch (err) {
    next(err);
  };
});

router.post('/login', checkUserExists, async (req, res, next) => {
  let { username, password } = req.body;

  try {
    const user = await Users.findBy({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = createToken(user);
      res.status(200).json({ message: `Welcome back ${user.username}`, token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  };
});


router.put('/editUser/:id', restricted, async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;
  if(!userData.password) {
    try {
      const updatedUser = await Users.editUser(id, userData);
      if (updatedUser) {
        res.status(204).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      next(err);
    };
  } else {
    try {
      const hash = bcrypt.hashSync(userData.password);
      userData.password = hash;
      const updatedUser = await Users.editUser(id, userData);
      if (updatedUser) {
        res.status(204).json(updatedUser);
      } else {
        res.status(404).json({ message: 'User not found'});
      }
    } catch (err) {
      next(err);
    };
  }
});

function createToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
  }
  const secret = jwtSecret;
  const options = {
    expiresIn: '5h',
  }
  return jwt.sign(payload, secret, options)
}

module.exports = router;
