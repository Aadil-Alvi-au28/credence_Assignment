const { Router } = require("express");
const Movies = require("../model/movies");
const multer = require("multer");
const base64 = require("js-base64");
require("dotenv").config();

const movieRoutes = Router();
//Clodinary Cnfiguration

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: "credence",
  api_key: process.env.Cloud_Api_key,
  api_secret: process.env.Cloud_Api_secret,
});
const upload = multer({
  storage: multer.memoryStorage(),
});

// Inserting Movies into DB
movieRoutes.post("/", upload.single("image"), async (req, res) => {
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
  } catch (error) {
    console.log(error);
  }
});

// Getting All Movies From DB
movieRoutes.get("/", async (req, res) => {
  try {
    let movies = await Movies.find({ deleted: false });
    res.json(movies);
  } catch (error) {
    console.log(error);
  }
});

// Getting single Movies From DB
movieRoutes.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Movies.find({ _id: id, deleted: false });
    res.json(result);
  } catch (error) {
    // console.log("Error posting data")
    res
      .status(500)
      .send({ status: "error", msg: "Error getting data from DB", error });
  }
});

// Updating Movies From DB
movieRoutes.put("/update/:id", upload.single("image"), async (req, res) => {
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
  } catch (error) {
    console.log(error);
  }
});

// Soft deleting Movies From DB
movieRoutes.put("/delete/:id", async (req, res) => {
  try {
    await Movies.updateOne({ _id: req.params.id }, { $set: { deleted: true } });
    res.json("movie Deleted");
  } catch (error) {
    console.log(error);
  }
});
// Hard deleting Movies From DB
movieRoutes.delete("/:id", async (req, res) => {
  try {
    let movies = await Movies.findById(req.params.id);
    await cloudinary.uploader.destroy(movies.cloudinary_id);
    await movies.deleteOne();
    res.json(movies);
  } catch (error) {
    console.log(error);
  }
});

module.exports = movieRoutes;
