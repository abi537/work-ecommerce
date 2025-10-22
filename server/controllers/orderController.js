const OrderValidation = require("../validator/OrderValidation");
const IdParamsValidation = require("../validator/IdParamsValidation");
const Order = require("../models/order");
const Product = require("../models/product");

module.exports = {
  // //  ---------------------------------------- //CreatOrder//--------------------------- //

  CreateOrder: async (req, res) => {
    try {
      const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        email,
        phoneNumber,
      } = req.body;
      const { errors, isValid } = OrderValidation(req.body);

      if (!isValid) {
        return res.status(400).json(errors);
      }
      const { firstName, lastName } = shippingAddress;
      const newOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName: `${firstName} ${lastName}`,
          ...shippingAddress,
        },
        paymentMethod,
        itemsPrice,
        shippingPrice,
        totalPrice,
        userEmail: email,
        userPhone: phoneNumber,
        user: req.user._id,
      });
      return res.status(201).json(newOrder);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
 //create order
// CreateOrder: async (req, res) => {
//   try {
//     const {
//       orderItems,
//       shippingAddress,
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       email,
//       phoneNumber,
//     } = req.body;

//     const { errors, isValid } = OrderValidation(req.body);
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }

//     // ✅ Validate product stock before order creation
//     for (const item of orderItems) {
//   const product = await Product.findById(item.product);

//   if (!product) {
//     return res.status(404).json({
//       message: `Product with id ${item.product} not found`,
//     });
//   }

//   if (product.countInStock === 0) {
//     return res.status(400).json({
//       message: `Product "${product.name}" is out of stock`,
//     });
//   }

//   if (item.quantity > product.countInStock) {
//     return res.status(400).json({
//       message: `Only ${product.countInStock} units available for "${product.name}"`,
//     });
//   }
// }




//     // ✅ If all validations pass, create the order
//     const { firstName, lastName } = shippingAddress;
//     const newOrder = await Order.create({
//       orderItems,
//       shippingAddress: {
//         fullName: `${firstName} ${lastName}`,
//         ...shippingAddress,
//       },
//       paymentMethod,
//       itemsPrice,
//       shippingPrice,
//       totalPrice,
//       userEmail: email,
//       userPhone: phoneNumber,
//       user: req.user._id,
//     });

//     // ✅ Reduce stock count for each ordered product
//     for (const item of orderItems) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { countInStock: -item.quantity },
//       });
//     }

//     return res.status(201).json(newOrder);
//   } catch (error) {
//     console.error("Error creating order:", error);
//     return res.status(500).send("Error: " + error.message);
//   }
// },

  //  ---------------------------------------- //GetOneOrder//--------------------------- //

  GetOneOrder: async (req, res) => {
    try {
      const { id } = req.params;
      const { errors, isValid } = IdParamsValidation(req.params);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const order = await Order.findById(id)
        .populate({
          path: "orderItems.images",
          model: "image",
        })
        .lean();

      if (!order) {
        return res.status(404).json("order not found");
      }
      return res.status(200).json(order);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //PayOrder//--------------------------- //

  PayOrder: async (req, res) => {
     try {
      const { id } = req.params;
      const { errors, isValid } = IdParamsValidation(req.params);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const order = await Order.findById(id);

      if (!order) {
        return res.status(404).json("order not found");
      }

      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };

      const updatedOrder = await order.save();

      return res.status(200).json(updatedOrder);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
//   PayOrder: async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { errors, isValid } = IdParamsValidation(req.params);
//     if (!isValid) {
//       return res.status(400).json(errors);
//     }

//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json("Order not found");
//     }

//     // Mark as paid
//     order.isPaid = true;
//     order.paidAt = Date.now();
//     order.paymentResult = {
//       id: req.body.id,
//       status: req.body.status,
//       update_time: req.body.update_time,
//       email_address: req.body.email_address,
//     };

//     // ✅ Deduct stock after payment success
//     const Product = require("../models/product");
//     for (const item of order.orderItems) {
//       await Product.findByIdAndUpdate(item.product, {
//         $inc: { countInStock: -item.quantity },
//       });
//     }

//     const updatedOrder = await order.save();
//     return res.status(200).json(updatedOrder);
//   } catch (error) {
//     console.error("PayOrder error:", error);
//     return res.status(500).send("Error: " + error.message);
//   }
// },

  //  ---------------------------------------- //GetMyOrders//--------------------------- //
  GetMyOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate({
          path: "orderItems.images",
          model: "image",
        })
        .lean();
      if (!orders) {
        return res.status(404).json("order not found");
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
   //  ---------------------------------------- //GetAllOrders//--------------------------- //
   GetAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate({
          path: "orderItems.images",
          model: "image",
        })
        .lean();
       if (!orders) {
        return res.status(404).json("no orders found");
      }

      return res.status(200).json(orders);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //DeleteOrder//--------------------------- //
  DeleteOrder: async (req, res) => {
      try {
        const { id } = req.params;
        const { errors, isValid } = IdParamsValidation(req.params);
        if (!isValid) {
          return res.status(400).json(errors);
        }
  
        const order = await Order.findById(id);
  
        if (!order) {
          return res.status(404).json("order not found");
        }
  
        await order.remove();
  
        return res.status(201).json();
      } catch (error) {
        return res.status(500).send("Error: " + error.message);
      }
    },
// // ---------------------------------------- //DeliverOrder//---------------------------------
// DeliverOrder: async (req, res) => {
//   try {
//     const { id } = req.params;
//     const order = await Order.findById(id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     order.isDelivered = true;
//     order.deliveredAt = Date.now();

//     const updatedOrder = await order.save();
//     return res.status(200).json(updatedOrder);
//   } catch (error) {
//     return res.status(500).send("Error: " + error.message);
//   }
// },
// controllers/orderController.js
// controllers/orderController.js
DeliverOrder: async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).json({ message: "Error: " + error.message });
  }
},


// ---------------------------------------- //MarkDelivered//--------------------------- //
MarkDelivered: async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    return res.status(200).json(updatedOrder);
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
},

};
