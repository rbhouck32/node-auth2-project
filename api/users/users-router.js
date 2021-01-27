const express = require("express");

const Users = require("./users-model.js");
const restricted = require("../../api/auth/restricted-middleware.js");

const router = express.Router();

router.get("/", restricted, async (req, res, next) => {
  try {
    const users = await Users.find();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
