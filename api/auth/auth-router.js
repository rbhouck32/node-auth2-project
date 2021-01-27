const express = require("express");

const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { isValid } = require("../users/users-service.js");
const { jwtSecret } = require("../../config/secrets.js");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res, next) => {
  const credentials = req.body;
  try {
    const newUser = await Users.add(credentials);
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;

      res.status(201).json({ message: "Success!", newUser });
    } else {
      res
        .status(400)
        .json({ message: "please provide a username and password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const allegedUser = await Users.findBy({ username: username });

    if (allegedUser && bcrypt.compareSync(password, allegedUser.password)) {
      const token = generateToken(allegedUser);
      res.status(200).json({ message: "Welcome to the API", token });
    } else {
      res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };
  const options = {
    expiresIn: 2000,
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
