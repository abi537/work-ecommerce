const ProductValidation = require("../validator/ProductValidation");
const IdParamsValidation = require("../validator/IdParamsValidation");
const Product = require("../models/product");
const Size = require("../models/size");
const Category = require("../models/category");
const Brand = require("../models/brand");
const Image = require("../models/image");
const { removeFromCloudinary } = require("../utils/cloudinaryHandler");
const handleImages = require("../utils/imageHandler");
const createCategories = require("../utils/categoriesHandler");

module.exports = {
  //  ---------------------------------------- //GetCategories&sizes&Brands//--------------------------- //

  // Getoptions: async (req, res) => {
  //   try {
  //     const options = {};

  //     const getSizeNames = Size.find({}, { name: 1, _id: 1 }).lean().exec();
  //     const categories = await Category.find({}).lean().exec();
  //     const getBrandNames = Brand.find({}, { name: 1, _id: 1 }).lean().exec();

  //     const [sizeNames, brandNames] = await Promise.all([
  //       getSizeNames,
  //       getBrandNames,
  //     ]);

  //     options.sizes = sizeNames;
  //     options.categories = createCategories(categories);
  //     options.brands = brandNames;

  //     return res.status(200).json(options);
  //   } catch (error) {
  //     return res.status(500).send("Error: " + error.message);
  //   }
  // },
  Getoptions: async (req, res) => {
  try {
    const [categories, sizes, brands] = await Promise.all([
      Category.find({}).lean().exec(),
      Size.find({}, { name: 1, _id: 1 }).lean().exec(),
      Brand.find({}, { name: 1, _id: 1 }).lean().exec(),
    ]);

    // Format categories for the frontend dropdown
    const formattedCategories = categories.map(cat => ({
      category: cat.parentId ? 'Subcategory' : 'Main', // or use your own logic
      childCategories: {
        id: cat._id,
        name: cat.name
      }
    }));

    return res.status(200).json({
      categories: formattedCategories,
      sizes,
      brands
    });
  } catch (error) {
    return res.status(500).send("Error: " + error.message);
  }
},

  //  ---------------------------------------- //AddProduct//--------------------------- //

  AddProduct: async (req, res) => {
if (typeof req.body.sizes === 'string') {
  req.body.sizes = JSON.parse(req.body.sizes);
}

    console.log("Received product data:", req.body);
    console.log("Files:", req.files || req.body.images);
    try {
      const {
        name,
        description,
        price,
        category,
        sizes,
        countInStock,
        brand,
        isFeatured,
        isArchived,
      } = req.body;
      const { errors, isValid } = ProductValidation(req.body);

      if (!isValid) {
        console.log("Validation failed:", errors);
        return res.status(400).json(errors);
      }

      const createdImages = await handleImages(req.body.images);
console.log("Created Images:", createdImages);
      const newProduct = await Product.create({
        name,
        description,
        price,
        category,
        sizes,
        images: createdImages,
        countInStock,
        brand,
        isArchived,
        isFeatured,
      });
 console.log("✅ Product Created:", newProduct);
      return res.status(201).json(newProduct);
    } catch (error) {
      console.error("🔥 AddProduct error:", error);
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //GetOneProduct//--------------------------- //
  GetOneProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const { errors, isValid } = IdParamsValidation(req.params);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const product = await Product.findById(id)
        .populate("images", "_id url cloudinary_id")
        .select(
          "_id name price countInStock images sizes category brand isFeatured isArchived description"
        );

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.status(200).json(product);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //GetProducts//--------------------------- //
  GetProducts: async (req, res) => {
    try {
      const products = await Product.aggregate([
        {
          $match: {},
        },
        {
          $lookup: {
            from: "images",
            localField: "images",
            foreignField: "_id",
            as: "images",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "category.parentCategory",
            foreignField: "_id",
            as: "parentCategory",
          },
        },
        {
          $lookup: {
            from: "sizes",
            localField: "sizes",
            foreignField: "_id",
            as: "sizes",
          },
        },
        {
          $lookup: {
            from: "brands",
            localField: "brand",
            foreignField: "_id",
            as: "brand",
          },
        },
        {
          $unwind: "$brand",
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            price: 1,
            countInStock: 1,
            "brand.name": 1,
            images: { _id: 1, url: 1, cloudinary_id: 1 },
            // sizes: { _id: 1, name: 1 },
            sizes: { _id: 1, name: 1 },

            // category: {
            //   _id: 1,
            //   name: { $arrayElemAt: ["$category.name", 0] },
            //   parentCategory: { $arrayElemAt: ["$parentCategory.name", 0] },
            // },
            category: {
  _id: { $arrayElemAt: ["$category._id", 0] }, // ✅ include _id
  name: { $arrayElemAt: ["$category.name", 0] },
  parentCategory: { $arrayElemAt: ["$parentCategory.name", 0] },
},

            createdAt: 1,
            updatedAt: 1,
            isFeatured: 1,
            isArchived: 1,
          },
        },
      ]);

      return res.status(200).json(products);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //DeleteProductImages//--------------------------- //
  DeleteProductImages: async (req, res) => {
    try {
      const { id } = req.params;
      const { url, _id, cloudinary_id } = req.body;
      const { errors, isValid } = IdParamsValidation(req.params);
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const image = await Image.findById(_id);
      const product = await Product.findById(id);

      if (!image) {
        return res.status(404).json("image not found");
      }
      await removeFromCloudinary(cloudinary_id);
      await image.remove();
      product.images.pull(_id);
      await product.save();
      return res.status(200).json();
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
  //  ---------------------------------------- //UpdateProducts//--------------------------- //
  UpdateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        category,
        sizes,
        countInStock,
        brand,
        isFeatured,
        isArchived,
      } = req.body;
      const { errors, isValid } = IdParamsValidation(req.params);
      if (!isValid) {
        return res.status(400).json(errors);
      }
      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json("product not found");
      }
      const createdImages = await handleImages(req.body.images);
       let parsedSizes = [];
    if (req.body.sizes) {
      try {
        parsedSizes = typeof req.body.sizes === "string"
          ? JSON.parse(req.body.sizes)
          : req.body.sizes;
      } catch (err) {
        console.error("Failed to parse sizes:", err);
        return res.status(400).json({ message: "Invalid sizes format" });
      }
    }

      product.images.push(...createdImages);
      product.name = name;
      product.description = description;
      product.price = price;
      product.category = category;
      product.sizes = parsedSizes;
      product.countInStock = countInStock;
      product.brand = brand;
      product.isFeatured = isFeatured;
      product.isArchived = isArchived;

      const updatedProduct = await product.save();
      return res.status(200).json(updatedProduct);
    } catch (error) {
      return res.status(500).send("Error: " + error.message);
    }
  },
};
