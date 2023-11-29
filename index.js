const express = require("express");
const mongoose = require("mongoose");
const { resource } = require("./constant");

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(resource.text.connectionString);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// Defining auth route
app.use("/api/auth", require("./routes/authRoute"));

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
  console.log("Connected to MongoDB");
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
