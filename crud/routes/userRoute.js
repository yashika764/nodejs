const express = require("express");
const { createUser, getAllUser, updateUser, deleteUser, loginUser, logoutUser, userById, createRole, getAllRoles, sendotp, verifyotp } = require("../controller/userController");
const route = express.Router();
const auth = require("../middleware/authMiddleware");

route.get("/", auth, getAllUser)
route.get("/fetch/:id", auth, userById)
route.post("/create", auth, createUser)
route.post("/login", loginUser)
route.put("/update/:id", auth, updateUser);
route.delete("/delete/:id", auth, deleteUser)
route.post("/logout", auth, logoutUser)
route.post("/sendotp", auth, sendotp)
route.post("/verifyotp", auth , verifyotp)


route.post("/create/role", auth, createRole);
route.get("/get/all/roles", auth, getAllRoles)




module.exports = route;