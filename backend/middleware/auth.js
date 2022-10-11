const catchAsyncError = require('../middleware/catchAsyncError');
const ErrorHandler = require('../utils/errorHandler');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// is auth user or not
exports.isAuthUser = catchAsyncError( async(req, res, next) => {
  const token = req.cookies.token;
  if(!token){
    return next(new ErrorHandler('please login to continue', 401));
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decode.id);

  next();
});

// find role 
exports.authorizedRole = (...roles) => (req, res, next) => {
  if(!roles.includes(req.user.role)){
    return next(new ErrorHandler(`user is not allowed to access this resource`, 403));
  }
  next();
}