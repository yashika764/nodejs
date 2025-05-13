const mongoose = require("mongoose")

const whishListSchema = new mongoose.Schema({
    place: {
        type:mongoose.Schema.ObjectId,
        ref:"Place"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

const WishList = mongoose.model("WishList", whishListSchema)
module.exports = WishList