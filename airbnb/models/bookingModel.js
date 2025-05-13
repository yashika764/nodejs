const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    guest: {
        adults: {
            type: Number
        },
        childern: {
            type: Number
        }
    },
    totalGuests: {
        type: Number
    },
    checkIn: {
        type: Date
    },
    checkOut: {
        type: Date
    },
    totalNight: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    place:{
        type:mongoose.Schema.ObjectId,
        ref:"Place"
    },
    isPayment:{
        type:Boolean,
        default:false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

const Booking = mongoose.model("Booking", bookingSchema)
module.exports = Booking 