exports.seed = function (knex) {
  return knex("users").insert([
    {
      username: "rbhouck32",
      password: "1234",
      department: "Front End Developer",
    },
    {
      username: "kayleep1123",
      password: "1234",
      department: "Back End Developer",
    },
    { username: "cdtrumbull", password: "1234", department: "Marketing" },
  ]);
};
