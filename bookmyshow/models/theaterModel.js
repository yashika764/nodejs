const mongoose=require("mongoose")

const theaterSchema=new mongoose.Schema({
    theatreName: {
        type: String,
        required: true
    },
    location:{
        type:String,
        required:true
    },
    totalSeats:{
        type:Number,
        required:true
    }
})

const Theater=mongoose.model("Theater",theaterSchema);
module.exports=Theater