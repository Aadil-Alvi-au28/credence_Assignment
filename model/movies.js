const mongoose = require("mongoose");
const moviesSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  img: String,
  summary: {
    type: String,
  },
  deleted: { type: Boolean, require: true },
});

module.exports = mongoose.model("Movies", moviesSchema);
