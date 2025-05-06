let mongoose=require("mongoose")

const dbConnect=()=>{
    mongoose.connect(process.env.DB_URL,{
        
    })
    .then(() => {
        console.log("database connected");
        
    })
   .catch(()=>{
    console.log("err");
    
   })
    
}

module.exports=dbConnect;