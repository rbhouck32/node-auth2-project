const db = require("../../database/connection.js");

module.exports = {
  add,
  find,
  findById,
};

async function add(user) {
  const [id] = await db("users").insert(user, "id");
  return findById(id);
}

function find() {
  return db("users");
}

function findById(id) {
  return db("users").where("id", id).first();
}
