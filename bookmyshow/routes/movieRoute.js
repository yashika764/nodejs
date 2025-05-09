const express = require("express");
const { getAllRoles, createRole, createUser, loginUser, createMovie, getAllMovie, movieById, updateMovie, deleteMovie, bookTicket, updateTicket, createTheater, getAllTheater, createShow, getAllShow, createBooking, updateTheater, deleteTheater, updateBooking, cancelBooking, getAllBooking, updateShow, deleteShow, ScreenCreate, screenUpdate, createSeat } = require("../controller/movieController");
const { auth, isAdmin, isUser, isAccess } = require("../middleware/tokenMiddleware");
const upload = require("../middleware/multer");
const route = express.Router();

route.post("/create/role", createRole);
route.get("/get/all/roles", getAllRoles);

route.post("/user/create", auth, createUser)
route.post("/user/login", loginUser)

route.get("/get/all", auth, getAllMovie)
route.get("/get/:id", auth, movieById)
route.post("/create", auth, isAdmin, upload.single("movieImage"), createMovie)
route.put("/update/:id", auth, isAdmin, upload.single("movieImage"), updateMovie)
route.delete("/delete/:id", auth, isAdmin, deleteMovie)

route.get("/get/all/theater", auth, getAllTheater)
route.post("/theater/create", auth, isAdmin, createTheater)
route.put("/theater/update/:id", auth, isAdmin, updateTheater)
route.delete("/theater/delete/:id", auth, isAdmin, deleteTheater)

route.get("/get/all/show", auth, getAllShow)
route.post("/create/show", auth, isAdmin, createShow)
route.put("/show/update/:id", auth, isAdmin, updateShow)
route.delete("/show/delete/:id", auth, isAdmin, deleteShow)

route.get("/booking/get/all", auth, isAdmin, getAllBooking)
route.post("/create/booking/:id", auth, isAccess, createBooking)
route.put("/booking/update/:bookingId", auth, isAccess, updateBooking)
route.delete("/booking/delete/:bookingId", auth, isAccess, cancelBooking)

route.post("/screen/create", auth, isAdmin, ScreenCreate)
route.put("/screen/update/:id", auth, isAdmin, screenUpdate)

route.post("/create/seat/:id", auth, isAdmin, createSeat)

module.exports = route;