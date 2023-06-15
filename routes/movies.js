const { Router } = require("express");
const multer = require("multer");
require("dotenv").config();

const {
  InsertMovieData,
  getAllMoviesData,
  getDataById,
  updateMovieData,
  softDeleteData,
  hardDeleteData,
} = require("../controller/moviesController");

const movieRoutes = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Inserting Movies into DB
movieRoutes.post("/", upload.single("image"), InsertMovieData);

// Getting All Movies From DB
movieRoutes.get("/", getAllMoviesData);

// Getting single Movies From DB
movieRoutes.get("/:id", getDataById);

// Updating Movies From DB
movieRoutes.put("/update/:id", upload.single("image"), updateMovieData);

// Soft deleting Movies From DB
movieRoutes.put("/delete/:id", softDeleteData);

// Hard deleting Movies From DB
movieRoutes.delete("/:id", hardDeleteData);

module.exports = movieRoutes;
