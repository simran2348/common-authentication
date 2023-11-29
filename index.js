const express = require("express");
const mongoose = require("mongoose");
const { connectionString } = require("./constant");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(connectionString);

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
