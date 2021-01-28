const express = require("express");

const router = express.Router();

const bcrypt = require("bcryptjs");
const { isValid } = require("../users/users-service.js");
const { generateToken } = require("./auth-services.js");

const Users = require("../users/users-model.js");

router.post("/register", async (req, res, next) => {
  const credentials = req.body;
  try {
    if (isValid(credentials)) {
      const rounds = process.env.BCRYPT_ROUNDS || 8;
      const hash = bcrypt.hashSync(credentials.password, rounds);
      credentials.password = hash;
      const newUser = await Users.add(credentials);

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

// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const allegedUser = await Users.findBy({ username });

//     if (allegedUser && bcrypt.compareSync(password, allegedUser.password)) {
//       const token = generateToken(allegedUser);
//       res.status(200).json({ message: "Welcome to the API", token });
//     } else {
//       res.status(401).json({ message: "Invalid Credentials" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const allegedUser = await Users.findBy({ username });
    if (isValid(req.body)) {
      console.log(allegedUser.password);
      if (
        allegedUser.username &&
        bcrypt.compareSync(password, allegedUser.password)
      ) {
        // build token and send it back
        const token = generateToken(allegedUser);
        res.status(200).json({ message: "Welcome to the API", token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    } else {
      res.status(400).json({ message: "Please provide username and password" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
