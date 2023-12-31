require("dotenv").config();

const resource = {
  routes: {
    login: "/login",
    checkUsername: "/checkUsername",
    register: "/register",
    forgotPassword: "/forgotPassword",
    getUser: "/getUser",
  },
  errorText: {
    usernameCheck: {
      check1: "Username is Required",
      check2: "Username must have atleast 6 letters",
    },
    emailCheck: "Please add a valid email",
    passwordCheck: "Please enter a password  with 6 or more characters",
    userExists: { text: "User Already Exists", code: "ERR_USER_001" },
    serverError: { text: "Server Error", code: "ERR_SERVER_001" },
    tokenError: {
      noToken: {
        text: "No token, Authorization Denied",
        code: "ERR_TOKEN_001",
      },
      tokenNotValid: {
        text: "Token is not valid",
        code: "ERR_TOKEN_002",
      },
    },
  },
  successText: {
    registrationSuccess: {
      text: "Registration successful",
      code: "SUCCESS_REG",
    },
    loginSuccess: {
      text: "Login successful",
      code: "SUCCESS_LOGIN",
    },
  },
  text: {
    connectionString: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}/`,
  },
};

module.exports = { resource };
