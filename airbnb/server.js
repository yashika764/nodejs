require("dotenv").config();
const htttp = require("http")
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./db/dbConnect");
const bookingRoute = require("./routes/bookingRoute");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cloudinary = require("cloudinary")
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles: true,
    
}));

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


app.use("/airbnb", bookingRoute)

dbConnect()

htttp.createServer(app).listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);

})
