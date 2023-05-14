const addUser = "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)";
const checkEmailExist = "SELECT * FROM users WHERE email = $1";
const findUserById = "SELECT * FROM users WHERE id = $1";
const checkToken = "SELECT * FROM users WHERE accesstoken = $1";
const updateUser =
  "UPDATE users SET accesstoken = $2, refreshtoken = $3 WHERE id = $1";
const findUserByToken = "SELECT * FROM users WHERE refreshtoken = $1";

export {
  addUser,
  checkEmailExist,
  findUserById,
  updateUser,
  checkToken,
  findUserByToken,
};
