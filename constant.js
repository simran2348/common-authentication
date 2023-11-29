require("dotenv").config();

exports.connectionString = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_DATABASE}.0bsrtss.mongodb.net/`;
