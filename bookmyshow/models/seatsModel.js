const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({


    seatNumber: {
        type: Number
    },
    screen: {
        type: mongoose.Schema.ObjectId,
        ref: "Screen"
    }

})

const Seat = mongoose.model("Seat", seatSchema)
module.exports = Seat;