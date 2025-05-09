const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    seats: {
        type: mongoose.Schema.ObjectId,
        ref: 'Seat'
    },
    seatsBooked:[{
        type:String
    }],
    totalPrice: {
        type: Number,
    },
    numberOfSeats: {
        type: Number,
    },
    show: {
        type: mongoose.Schema.ObjectId,
        ref: "Show"
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    movie:{
        type:mongoose.Schema.ObjectId,
        ref:"movie"
    }

})

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking