const express = require("express");
const { createLibrary, getAllBook, updateBook, deleteBook } = require("../controller/libraryController");
const { createCategory } = require("../controller/categoryController");
const auth = require("../middleware/authMiddleware");
const { isAuth } = require("../middleware/auth");

const route = express.Router();

route.get("/get/all/book", auth, getAllBook)
route.post("/book/create", auth, isAuth, createLibrary)
route.put("/book/update/:id", auth, isAuth, updateBook)
route.delete("/book/delete/:id", auth, isAuth, deleteBook)

route.post("/create/category", auth, isAuth, createCategory)

module.exports = route;