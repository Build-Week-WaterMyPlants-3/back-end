const Users = require('../users/usersModel');

const uniqueName = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || username === null || !password || password === null) {
    res.status(500).json({ message: "username and password required" });
  } else {
  const user = await Users.findBy({username: req.body.username})
  if (user) {
      console.log(user)
      res.status(422).json({ message: "username taken" });
    } else {
      req.user = user;
      next();
    }
  }
}

const checkUserExists = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || username === null || !password || password === null) {
    res.status(500).json({ message: "username and password required" });
  } else {
  const user = await Users.findBy({username: req.body.username})
  if (!user) {
      console.log(user)
      res.status(422).json({ message: "Invalid credentials" });
    } else {
      req.user = user;
      next();
    }
  }
}

module.exports = {
  checkUserExists,
  uniqueName,
} 