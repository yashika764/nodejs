require("dotenv").config();
const htttp = require("http")
const express = require("express");
const dbConnect = require("./db/dbConnect");
const userRoute = require("./routes/userRoute")
const libraryRoute = require("./routes/libraryRoute")
const cookieParser = require("cookie-parser")
const app = express();


app.use(express.json());
app.use(express.json({ extended: false }))
app.use(cookieParser())

app.use("/user", userRoute)
app.use("/library", libraryRoute)

dbConnect();

htttp.createServer(app).listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);

})