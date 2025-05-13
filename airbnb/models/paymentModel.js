const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    booking: {
        type: mongoose.Schema.ObjectId,
        ref: "Booking"
    },
    paymentBy: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }

}, { timestamps: true })

const Payment = mongoose.model("Payment", paymentSchema)
module.exports = Payment