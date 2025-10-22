const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require('../models/order');
const Product = require('../models/product');


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
module.exports = {
  
  //  ---------------------------------------- //getstripeapikey//--------------------------- //

  getstripeapikey: async (req, res) => {
    try {
      res.status(200).json(process.env.STRIPE_API_KEY);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //paymentProcess//--------------------------- //
  paymentProcess: async (req, res) => {
     try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.totalPrice,
        currency: "USD",
        metadata: {
          company: "oldShop",
        },
        automatic_payment_methods: { enabled: true },
      });
      res.status(200).json(paymentIntent.client_secret);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },

//----------------------------------------//
  // getRazorpayKey
  //----------------------------------------//
  getRazorpayKey: async (req, res) => {
    console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
    console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET ? "Loaded ✅" : "Missing ❌");

    try {
      res.status(200).json(process.env.RAZORPAY_KEY_ID);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },

 //----------------------------------------//
// createRazorpayOrder
//----------------------------------------//
createRazorpayOrder: async (req, res) => {
  console.log("🟩 [DEBUG] createRazorpayOrder called at:", new Date().toISOString());
console.log("🟩 [DEBUG] req.body:", req.body);

  try {
    const { totalPrice } = req.body;
    console.log("🟩 Received request to create order:", req.body);
    const options = {
      amount: Math.round(totalPrice * 100), // convert to paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
console.log("🟨 Razorpay order options:", options);
    const order = await razorpay.orders.create(options);
console.log("✅ Razorpay order created successfully:", order);
    res.status(200).json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID, // 👈 send publishable key to frontend
    });
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    return res.status(500).send("Error: " + error.message);
  }
},


// //   //----------------------------------------//
// //   // verifyRazorpayPayment OG
// //   //----------------------------------------//
//   verifyRazorpayPayment: async (req, res) => {
//     try {
//       const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
// console.log("🟩 Received verification request:", req.body);

//       const sign = razorpay_order_id + "|" + razorpay_payment_id;
//       const expectedSign = crypto
//         .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//         .update(sign)
//         .digest("hex");

//     console.log("🟨 Generated expected signature:", expectedSign);
//     console.log("🟨 Razorpay signature from frontend:", razorpay_signature);
//       if (razorpay_signature === expectedSign) {
//         console.log("✅ Payment verified successfully");
//         res.status(200).json({ verified: true });
//       } else {
//         console.log("❌ Payment verification failed: signature mismatch");
//         res.status(400).json({ verified: false });
//       }
//     } catch (error) {
//       console.error("❌ Error verifying Razorpay payment:", error);
//       return res.status(500).send("Error: " + error.message);
//     }
//   },

verifyRazorpayPayment: async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // ✅ Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ verified: false, message: "Invalid signature" });
    }

    // ✅ Fetch the order
    const order = await Order.findById(orderId).populate("orderItems.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Mark order as paid
    order.isPaid = true;
    order.paidAt = Date.now();

    // ✅ Update stock for each product if not already updated
    if (!order.stockUpdated) {
      for (const item of order.orderItems) {
        const product = await Product.findById(item.product._id);
        if (!product) continue;
console.log(`🧾 Product ${product.name}: stock=${product.countInStock}, quantity=${item.quantity}`);

        // Make sure stock is enough
        if (product.countInStock >= item.quantity) {
          product.countInStock -= item.quantity;
          await product.save();
        } else {
          return res.status(400).json({ message: `Not enough stock for ${product.name}` });
        }
      }
      order.stockUpdated = true;
    }

    await order.save();

    res.status(200).json({ verified: true, message: "Payment verified and stock updated" });

  } catch (error) {
    console.error("❌ Error verifying Razorpay payment:", error);
    return res.status(500).send("Error: " + error.message);
  }

},
};