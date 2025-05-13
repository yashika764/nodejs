const express = require("express");
const { createRole, getAllRoles, createUser, loginUser, createPlace, updatePlace, getAllPlace, deletePlace, createBooking, updateBooking, createCategory } = require("../controller/bookingController");
const { auth, isAdmin, isAccess } = require("../middleware/auth")

const router = express.Router()

router.route("/create/role").post(createRole);
router.route("/get/all/role").get(getAllRoles);

router.route("/user/create").post(auth, createUser);
router.route("/user/login").post(loginUser);

router.route("/category/create").post(auth, isAdmin, createCategory)

router.route("/place/get/all").get(auth, getAllPlace)
router.route("/create/place").post(auth, isAdmin, createPlace)
router
    .route("/place/:id")
    .put(auth, isAdmin, updatePlace)
    .delete(auth, isAdmin, deletePlace)

router.route("/place/booking/create").post(auth, isAccess, createBooking)
router.route("/place/booking/:bookingId").put(auth, isAccess, updateBooking)

module.exports = router