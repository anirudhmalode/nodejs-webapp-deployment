/* A Schematic for the ideas in the project includes, title, details,
   user(user_ids--individuals), date */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const IdeaSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

mongoose.model("ideas", IdeaSchema);
