require("dotenv").config();
const htttp = require("http")
const express = require("express");
const cookieParser = require("cookie-parser");
const dbConnect = require("./db/dbConnect");
const movieRoute=require("./routes/movieRoute");
const path = require("path");
const app = express();


app.use(express.json());
app.use(express.json({ extended: false }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/movie", movieRoute)

dbConnect();

htttp.createServer(app).listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);

})
