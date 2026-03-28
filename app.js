const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const surveyRoutes = require("./routes/surveyRoutes");

const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/surveyDB")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", surveyRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});