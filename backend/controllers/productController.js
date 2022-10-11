const Product = require("../models/productModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ApiFeatures = require("../utils/apiFeatures");

// get all products
exports.getAllProducts = catchAsyncError( async(req, res, next)=>{
  
  const resultPerPage = 5;
  const productsCount = await Product.countDocuments();

  let apiFeatures = new ApiFeatures(Product.find(), req.query).search().filter().pagination(resultPerPage);

  let products = await apiFeatures.query;

  res.json({
    success: true,
    productsCount,
    products
  })
});

// get product details
exports.getPrdouctDetails = catchAsyncError( async(req, res, next)=>{
  const product = await Product.findById(req.params.id);

  if(!product){
    return next(new ErrorHandler('product does not exist', 404))
  }

  res.json({
    success: true,
    product
  })

});

// create product --admin
exports.createPrdouct = catchAsyncError( async(req, res, next)=>{
  req.body.user = req.user._id;
  
  const product = await Product.create(req.body);
  
  res.send({
    success: true,
    product
  });
});

// get all products --admin
exports.getAdminProducts = catchAsyncError( async(req, res, next)=>{
  const products = await Product.find();
  res.json({
    success: true,
    products
  });
});

// update product --admin
exports.updatePrdouct = catchAsyncError( async(req, res, next)=>{
  let product = await Product.findOne({_id:req.params.id});
  
  if(!product){
    return next(new ErrorHandler('product does not exist', 404))
  }


  if(String(req.user.id ) !== String(product.user)){
    return next(new ErrorHandler('you cannot access this resource', 403))
  }

  product = await Product.findOneAndUpdate({_id:req.params.id}, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false
  });

  res.json({
    success: true,
    product
  })
  
});

// delete product --admin
exports.deletePrdouct = catchAsyncError( async(req, res, next)=>{
  let product = await Product.findOne({_id:req.params.id});
  
  if(!product){
    return next(new ErrorHandler('product does not exist', 404))
  }

  if(String(req.user.id ) !== String(product.user)){
    return next(new ErrorHandler('you cannot access this resource', 403))
  }

  product = await Product.findByIdAndDelete({_id:req.params.id});

  res.json({
    success: true,
    message: 'product deleted successfully'
  })
  
});

// create or update product review
exports.createProductReview = catchAsyncError( async(req, res, next)=>{
  const {rating, comment, productId} = req.body;
  const review = {
    user: req.user._id,
    name: req.user.name,
    rating,
    comment
  };

  const product = await Product.findById(productId);

  const isReviwed = await product.reviews.find(rev => String(rev.user) === String(req.user._id) );

  if(isReviwed){
    product.reviews.forEach(rev => {
      if(String(rev.user) === String(req.user._id)){
        rev.rating = rating;
        rev.comment = comment;
      }
    })
  }else{
    product.reviews.push(review);
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;
  
  product.numOfReviews = product.reviews.length;

  await product.save({validateBeforeSave: false});

  res.json({
    success: true,
    product
  })
});


// get all reviews of product
exports.getProductReviews = catchAsyncError( async(req, res, next)=>{
  const product = await Product.findById(req.query.productId);

  if(!product){
    return next(new ErrorHandler('product does not exist', 404))
  }

  res.json({
    success: true,
    reviews: product.reviews
  })
  
});

// delete reviews of product
exports.deleteProductReview = catchAsyncError( async(req, res, next)=>{
  const product = await Product.findById(req.query.porductId);

  if(!product){
    return next(new ErrorHandler('product does not exist', 404))
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.json({
    success: true,
    message: 'review deleted successfully'
  })
  
});