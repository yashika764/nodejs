const mongoose = require("mongoose")

const showSchema = new mongoose.Schema({
    showTime: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    screen: {
        type: Number,
        required: true
    },
    seats: [{
        seatNumber:{
            type:String,
        },
        isBooked:{
            type:Boolean,
            default:false
        }
    }],
    theater: {
        type: mongoose.Schema.ObjectId,
        ref: "Theater"
    },
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: "Movie"
    }

})

const Show = mongoose.model("Show", showSchema);
module.exports = Show