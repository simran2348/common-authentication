require("dotenv").config();

const resource = {
  routes: {
    login: "/login",
    checkUsername: "/checkUsername",
    register: "/register",
    forgotPassword: "/forgotPassword",
  },
  text: {
    connectionString: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}/`,
    usernameCheck: "Username is Required",
    emailCheck: "Please add a valid email",
    passwordCheck: "Please enter a password  with 6 or more characters",
    userExists: "User Already Exists",
    serverError: "Server Error",
  },
};

module.exports = { resource };
