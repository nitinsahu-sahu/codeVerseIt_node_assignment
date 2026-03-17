const express = require("express");
const router = express.Router();
const {createOrder,getMyOrders,getResturentOrders,orderCancel,orderAccept} = require("../controllers/orderControllers");
const { auth } = require("../middlewares/authMiddleware");
const { isOwner,isCustomer } = require("../middlewares/roleMiddleware");
// Insert data
router.get("/me",auth, getMyOrders);
router.post("/",auth,isCustomer, createOrder);
router.get("/restaurant",auth,isOwner, getResturentOrders);
router.patch("/:orderId/accept",auth,isOwner, orderAccept);
router.patch("/:orderId/cancel",auth,isOwner, orderCancel);

module.exports = router;