const express = require("express");
const app = express();
const dbHelper = require("./config/db.js");
const dotenv = require("dotenv");
const movieRoutes = require("./routes/movies.js");
const prt = 5000;

dotenv.config();
dbHelper();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(movieRoutes);

app.listen(prt, () => {
  console.log("Server is running");
});
