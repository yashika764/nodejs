const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    
    movieName: {
        type: String,
        required: true
    },
    movieImage: {
        type: String,
    },
    language: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    deletedAt: {
        type: Date
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    isDeleted: {
        type: Boolean,
        default: false
    }



}, { timestamps: true })

const Movie = mongoose.model("Movie", movieSchema);
module.exports = Movie