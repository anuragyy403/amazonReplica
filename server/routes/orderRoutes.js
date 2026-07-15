const express = require('express');

const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
} = require("../controllers/orderController")

const {protect,admin} = require('../middleware/authMiddleware');

const router = express.Router();

router.post("/",protect,createOrder);
router.get("/myorders",protect,getMyOrders);
router.get("/:id",protect,getOrderById);
router.get("/",admin,getAllOrders);

module.exports = router;



