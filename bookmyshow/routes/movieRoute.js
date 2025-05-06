const express = require("express");
const { getAllRoles, createRole, createUser, loginUser, createMovie, getAllMovie, movieById, updateMovie, deleteMovie, bookTicket, updateTicket, createTheater, getAllTheater, createShow, getAllShow, createBooking } = require("../controller/movieController");
const { auth, isAdmin, isUser } = require("../middleware/tokenMiddleware");
const upload = require("../middleware/multer");
const route = express.Router();

route.post("/create/role", createRole);
route.get("/get/all/roles", getAllRoles);

route.post("/user/create", auth, createUser)
route.post("/user/login", loginUser)

route.get("/get/all", auth, getAllMovie)
route.get("/get/:id", auth, movieById)
route.post("/create", auth, isAdmin, upload.single("movieImage"), createMovie)
route.put("/update/:id", auth, isAdmin, updateMovie)
route.delete("/delete/:id", auth, isAdmin, deleteMovie)

route.get("/get/all/theater", auth, getAllTheater)
route.post("/create/theater", auth, isAdmin, createTheater)

route.get("/get/all/show", auth, getAllShow)
route.post("/create/show", auth, isAdmin, createShow)

route.post("/create/booking", auth, isUser, createBooking)

module.exports = route;