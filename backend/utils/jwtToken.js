module.exports = sendToken = async (res, user) => {
  const token = await user.getJwtToken();

  res
    .cookie("token", token, {
      expire: 7*24*60*60*1000,
      httpOnly: true,
    })
    .json({
      success: true,
      user,
      token,
    });
};


