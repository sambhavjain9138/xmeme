var mongoose = require("mongoose");

// The following is the structure of the database for a meme. the database will contain multiple such entries of this schema
var memeSchema = new mongoose.Schema({
     // Name, url and caption is of string type. Of this, name and URL is required.
   name: {
        type: String,
        required: true
   },
   url: {
        type: String,
        required: true
   },
   caption: {
        type: String
    },
});

module.exports = mongoose.model("Meme", memeSchema);