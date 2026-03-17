const express = require("express");
const router = express.Router();
const {getMenu,addMenuItem,updateMenuItem} = require("../controllers/menuController");
const { auth } = require("../middlewares/authMiddleware");
const { isOwner } = require("../middlewares/roleMiddleware");

// Insert data
router.get("/me", getMenu);
router.patch("/:itemId",auth, isOwner, updateMenuItem);
router.post("/",auth,isOwner, addMenuItem);

module.exports = router;