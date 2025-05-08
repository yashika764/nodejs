const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema({

    seat: [
        {
            seatNumber: {
                type: String
            },
            row: {
                type: String
            },
            seatnum: {
                type: String
            },
            isBooked: {
                type: Boolean,
                default: false
            },
        }
    ],
    screen: {
        type: mongoose.Schema.ObjectId,
        ref: "Screen"
    }

})

const Seats = mongoose.model("Seats", seatSchema)
module.exports = Seats;