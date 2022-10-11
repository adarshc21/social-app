const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');

// create new order
exports.newOrder = catchAsyncError( async(req, res, next) => {
  
  const {shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice} = req.body;

  const order = await Order.create({
    shippingInfo, orderItems, paymentInfo, itemPrice, taxPrice, shippingPrice, totalPrice,
    paidAt: Date.now(), user: req.user._id,
  })

  res.json({
    success: true,
    order
  });
});

// get single order
exports.getSingleOrder = catchAsyncError( async(req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if(!order){
    return next( new ErrorHandler('order not found with this id', 404));
  }

  res.json({
    success: true,
    order
  })

});


// get logged user orders
exports.myOrders = catchAsyncError( async(req, res, next) => {
  const orders = await Order.find({user: String(req.user._id)});

  res.json({
    success: true,
    orders
  })

});


// get all orders --admin
exports.myOrders = catchAsyncError( async(req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  
  orders.forEach( order => {
    totalAmount+=order.totalPrice;
  });
  
  res.json({
    success: true,
    totalAmount,
    orders
  })
});

// update order status --admin
exports.updateOrder = catchAsyncError( async(req, res, next) => {
  const order = await Order.findById(req.params.id);
  
  if(order.orderStatus === 'delivered'){
    return next(new ErrorHandler('you have already deliverd this order', 400));
  }

  order.orderItems.forEach( async(item) => {
    updateStock(item.product, item.quantity);
  });
  
  order.orderStatus = req.body.orderStatus;

  if(req.body.orderStatus === 'delivered'){
    order.deliveredAt = Date.now();
  }

  order.save({validateBeforeSave: false})

  res.json({
    success: true,
    order
  })

});

// delete order --admin
exports.deleteOrder = catchAsyncError( async(req, res, next) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if(!order){
    return next( new ErrorHandler('order not found with this id', 404));
  }

  order.remove();
  
  res.json({
    success: true,
    message: 'order deleted successfully'
  })
});



    // update stock
    async function updateStock (id, quantity){
      const product = await Product.findById(id);
    
      product.Stock-=quantity;

      await product.save({validateBeforeSave: false});
    }