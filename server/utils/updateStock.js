const Product = require("../models/Product.model");

const updateProductStock = async (orderItems) => {
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (product) {
      // Prevent negative stock
      if (product.countInStock < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.name}`);
      }

      product.countInStock -= item.quantity;
      await product.save();
    }
  }
};

module.exports = { updateProductStock };
