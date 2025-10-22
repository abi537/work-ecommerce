const express = require("express");
const router = express.Router();
const PaymentController = require("../controllers/paymentController");
const { isAuth } = require("../middlewares/checkAuth");


router.post("/create-payment-intent", isAuth,PaymentController.paymentProcess );

router.get("/stripeapikey", isAuth, PaymentController.getstripeapikey);
//razorpay

// Razorpay routes
// router.post("/create-payment-intent", isAuth, PaymentController.paymentProcess);
router.get("/razorpaykey", isAuth, PaymentController.getRazorpayKey);
router.post("/create-razorpay-order", isAuth, PaymentController.createRazorpayOrder);
router.post("/verify-razorpay-payment", isAuth, PaymentController.verifyRazorpayPayment);

module.exports = router;