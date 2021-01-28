module.exports = {
  isValid,
};

function isValid(body) {
  return Boolean(
    body.username && body.password && typeof body.password === "string"
  );
}
