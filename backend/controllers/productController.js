const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const APIFeatures = require("../utils/apiFeatures");
const Cart = require("../models/cartModel");

// Get Products - /api/v1/products
exports.getProducts = catchAsyncError(async (req, res, next) => {
  const resPerPage = 12;

  try {
    // Construct the query using APIFeatures class
    const query = new APIFeatures(Product.find(), req.query)
      .search()
      .filter()
      .paginate(resPerPage);

    // Execute the query to get filtered products
    const products = await query.query;

    // Get the total count of products
    const totalProductsCount = await Product.countDocuments({});

    // Adjust products count if filtered products count is different
    const productsCount =
      products.length !== totalProductsCount
        ? products.length
        : totalProductsCount;

    // Send response with products data
    res.status(200).json({
      success: true,
      count: productsCount,
      resPerPage,
      products,
    });
  } catch (error) {
    // Handle error if any
    return next(new ErrorHandler(error.statusCode, error.message));
  }
});

//Create Product - /api/v1/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
  let images = [];
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;

  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

//Get Single Product - api/v1/product/:id
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "reviews.user",
    "name email"
  );

  if (!product) {
    return next(new ErrorHandler("Product not found", 400));
  }

  res.status(201).json({
    success: true,
    product,
  });
});

//Update Product - api/v1/product/:id
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  //uploading images
  let images = [];

  //if images not cleared we keep existing images
  if (req.body.imagesCleared === "false") {
    images = product.images;
  }
  let BASE_URL = process.env.BACKEND_URL;
  if (process.env.NODE_ENV === "production") {
    BASE_URL = `${req.protocol}://${req.get("host")}`;
  }

  if (req.files.length > 0) {
    req.files.forEach((file) => {
      let url = `${BASE_URL}/uploads/product/${file.originalname}`;
      images.push({ image: url });
    });
  }

  req.body.images = images;

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product - api/v1/product/:id
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted!",
  });
});

//Create Review - api/v1/review
exports.createReview = catchAsyncError(async (req, res, next) => {
  const { productId, rating, comment } = req.body;

  const review = {
    user: req.user.id,
    rating,
    comment,
  };

  const product = await Product.findById(productId);
  //finding user review exists
  const isReviewed = product.reviews.find((review) => {
    return review.user.toString() == req.user.id.toString();
  });

  if (isReviewed) {
    //updating the  review
    product.reviews.forEach((review) => {
      if (review.user.toString() == req.user.id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    //creating the review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  //find the average of the product reviews
  product.ratings =
    product.reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / product.reviews.length;
  product.ratings = isNaN(product.ratings) ? 0 : product.ratings;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

//Get Reviews - api/v1/reviews?id={productId}
exports.getReviews = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate(
    "reviews.user",
    "name email"
  );

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

//Delete Review - api/v1/review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  //filtering the reviews which does match the deleting review id
  const reviews = product.reviews.filter((review) => {
    return review._id.toString() !== req.query.id.toString();
  });
  //number of reviews
  const numOfReviews = reviews.length;

  //finding the average with the filtered reviews
  let ratings =
    reviews.reduce((acc, review) => {
      return review.rating + acc;
    }, 0) / reviews.length;
  ratings = isNaN(ratings) ? 0 : ratings;

  //save the product document
  await Product.findByIdAndUpdate(req.query.productId, {
    reviews,
    numOfReviews,
    ratings,
  });
  res.status(200).json({
    success: true,
  });
});

// get admin products  - api/v1/admin/products
exports.getAdminProducts = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).send({
    success: true,
    products,
  });
});

// Controller function to update the price of a product
exports.updateProductPrice = async (req, res) => {
  const { id } = req.params;
  const { newPrice } = req.body;

  try {
    // Find the product by its ID
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the price of the product
    product.price = newPrice;

    // Save the updated product
    await product.save();

    // Send a success response
    res.json({ message: "Product price updated successfully", product });
  } catch (error) {
    // Handle any errors and send an error response
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.propro = async (req, res) => {
  try {
    const { category, type } = req.query;

    let query = {};
    if (category) {
      query.category = category;
    }
    if (type) {
      query.type = type;
    }
    const products = await Product.find(query);
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// const Cart = require('../models/cartModel');
// const Product = require('../models/productModel');

// Add product to wishlist
exports.addCartItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.user._id; // assuming user is logged in and the user ID is available from the auth middleware

        // Find the product by ID
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find the user's cart
        let cart = await Cart.findOne({ user: userId });

        // If cart doesn't exist, create a new one
        if (!cart) {
            cart = new Cart({
                user: userId,
                items: []
            });
        }

        // Check if product already exists in the cart
        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));

        if (itemIndex > -1) {
            // If the product exists, update the quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // If the product does not exist, add it to the cart
            cart.items.push({
                product: product._id,
                name: product.name,
                image: product.images[0].image,
                price: product.rtprice,
                quantity,
                stock: product.stock
            });
        }

        // Save the updated cart
        await cart.save();

        res.status(200).json({
            success: true,
            message: 'Product added to cart successfully',
            cart
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateCart = async (req, res) => {
  const userId = req.user.id; // Assuming you are using a middleware to set req.user
  const { items } = req.body;

  try {
    const userCart = await Cart.findOneAndUpdate(
      { user: userId },
      { items },
      { new: true, upsert: true } // Creates a new cart if one doesn't exist
    );

    res.status(200).json({ success: true, cart: userCart });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to update cart",
        error: error.message,
      });
  }
};
