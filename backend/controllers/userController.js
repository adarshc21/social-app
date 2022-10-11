const User = require("../models/userModel");
const catchAsyncError = require("../middleware/catchAsyncError");
const sendToken = require("../utils/jwtToken");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");

// register new user
exports.resgister = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "photo",
      url: "photo.png",
    },
  });

  return sendToken(res, user);
});

// login user
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("invalid creditials", 400));
  }

  if (!user.comparePassword(password)) {
    return next(new ErrorHandler("invalid creditials", 400));
  }

  return sendToken(res, user);
});

// logout user
exports.logout = catchAsyncError(async (req, res, next) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "logout successfully",
    });
});

// forgot password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ErrorHandler("please enter  your email", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("invalid creditials", 400));
  }

  const token = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${token}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Ecommerce password recovery",
      html: `Your password reset token is : ${resetPasswordUrl}</br></br>if you not requested for this email then, please ignore it`,
    });
    res.json({
      success: true,
      message: `email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    user = await user.save({ validateBeforeSave: true });

    return next(new ErrorHandler(error.message, 500));
  }
});

// reset password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const { resetPasswordToken } = req.params.token;

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordToken: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("link is expires or invalid", 400));
  }

  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("password and confirm password must be same", 400)
    );
  }

  user.password = password;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  return sendToken(res, user);
});

// update password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const { password, confirmPassword, oldPassword } = req.body;

  if (!user.comparePassword(oldPassword)) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  if (password !== confirmPassword) {
    return next(
      new ErrorHandler("password and confirm password must be same", 400)
    );
  }

  user.password = password;
  await user.save();

  sendToken(res, user);
});

// update profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const { name, email } = req.body;
  const newUser = { name, email };
  const user = await User.findByIdAndUpdate(req.user._id, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  sendToken(res, user);
});

// get user details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.json({
    success: true,
    user,
  });
});

// get all user --admin
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = await User.find();

  res.json({
    success: true,
    user,
  });
});

// get single user --admin
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  res.json({
    success: true,
    user,
  });
});

// update user profile --admin
exports.updateSingleUser = catchAsyncError(async (req, res, next) => {
  const { name, email, role } = req.body;

  const newUser = { name, email, role };

  const user = await User.findOneAndUpdate({ _id: req.params.id }, newUser, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.json({
    success: true,
    user,
  });
});

// delete user role --admin
exports.deleteSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return next(new ErrorHandler("user does not exist", 400));
  }

  await user.delete();

  res.json({
    success: true,
    message: "user deleted successfully",
  });
});