const express = require("express");
const { createRole, getAllRoles, createUser, loginUser, createPlace } = require("../controller/bookingController");
const { auth } = require("../middleware/auth")

const router = express.Router()

router.route("/create/role").post(createRole);
router.route("/get/all/role").get(getAllRoles);

router.route("/user/create").post(auth, createUser);
router.route("/user/login").post(loginUser);

router.route("/create/place").post(auth, createPlace)



module.exports = router