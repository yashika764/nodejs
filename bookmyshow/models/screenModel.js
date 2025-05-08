const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({

    screen: [{
        screenName:{
            type:String
        }
    }],
    theater:{
        type:mongoose.Schema.ObjectId,
        ref:"Theater"
    }
})

const Screen = mongoose.model("Screen", screenSchema);
module.exports = Screen