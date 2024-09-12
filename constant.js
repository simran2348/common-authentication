require("dotenv").config();

const resource = {
  routes: {
    login: "/login",
    checkUsername: "/checkUsername",
    register: "/register",
    checkEmail: "/checkEmail",
    forgotPassword: "/forgotPassword",
    getUser: "/getUser",
    verifyEmail: "/verify/:token",
  },
  errorText: {
    emailCheck: "Please add a valid email",
    userExists: "Email already exists",
    invalidUser: "User does not exists",
    invalidPassword: "Password is invalid",
    serverError: "Server Error",
    tokenError: {
      noToken: "No token, Authorization Denied",
      tokenNotValid: "Token is not valid",
    },
  },
  successText: {
    registrationSuccess: "Registration successful",
    loginSuccess: "Login successful",
    success: "Success",
  },
  text: {
    connectionString: `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}/`,
    verificationEmailFrom: "app.com",
    verificationEmailSubject: "Email Verification",
    VerificationEmailBody:
      "Please click the following link to verify your email : ",
  },
};

module.exports = { resource };
