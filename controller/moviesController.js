const Movies = require("../model/movies");
const base64 = require("js-base64");
require("dotenv").config();
const logger = require("./logger");

//Clodinary Cnfiguration

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "credence",
  api_key: process.env.Cloud_Api_key,
  api_secret: process.env.Cloud_Api_secret,
});

// Inserting Movies into DB
const InsertMovieData = async (req, res) => {
  try {
    const data = req.body;

    // For getting Image data in File Format
    const fileData = req.file;

    if (fileData) {
      const bufferDataBase64 = base64.encode(fileData.buffer);
      const res = await cloudinary.uploader.upload(
        `data:${fileData.mimetype};base64,${bufferDataBase64}`
      );
      data.img = res.secure_url;
    }
    data.deleted = "false";
    await Movies.create(data);
    res.json("Movies Uploaded");
    logger.movieLogger.log("info", "Movie Successfully Uploaded");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in Uploding Movies");
  }
};

// Getting All Movies From DB
const getAllMoviesData = async (req, res) => {
  try {
    let movies = await Movies.find({ deleted: false });
    res.json(movies);
    logger.movieLogger.log("info", "Successfully got list of Movies");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in finding Movies");
  }
};

// Getting single Movies From DB
const getDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Movies.find({ _id: id, deleted: false });
    res.json(result);
    logger.movieLogger.log("info", "Successfully got the Movie");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in finding Movies");
  }
};

// Updating Movies From DB
const updateMovieData = async (req, res) => {
  try {
    let data = req.body;
    let movies = await Movies.findById(req.params.id);
    await cloudinary.uploader.destroy(movies.cloudinary_id);
    const fileData = req.file;

    if (fileData) {
      const bufferDataBase64 = base64.encode(fileData.buffer);
      const res = await cloudinary.uploader.upload(
        `data:${fileData.mimetype};base64,${bufferDataBase64}`
      );
      data.img = res.secure_url;
    }
    movies = await Movies.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(movies);
    logger.movieLogger.log("info", "Successfully update the Movie");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in Updating Movies");
  }
};

// Soft deleting Movies From DB
const softDeleteData = async (req, res) => {
  try {
    await Movies.updateOne({ _id: req.params.id }, { $set: { deleted: true } });
    res.json("movie Deleted");
    logger.movieLogger.log("info", "Successfully Soft Delete the Movie");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in Deleting Movies");
  }
};

// Hard deleting Movies From DB
const hardDeleteData = async (req, res) => {
  try {
    let movies = await Movies.findById(req.params.id);
    await cloudinary.uploader.destroy(movies.cloudinary_id);
    await movies.deleteOne();
    res.json(movies);
    logger.movieLogger.log("info", "Successfully Deleted the Movie from DB");
  } catch (error) {
    res.send({
      message: "An error occurred",
    });
    logger.movieLogger.log("error", "Error in Deleting Movies");
  }
};

module.exports = {
  InsertMovieData,
  getAllMoviesData,
  getDataById,
  updateMovieData,
  softDeleteData,
  hardDeleteData,
};
