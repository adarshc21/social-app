const {Schema, default: mongoose} = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    minLength: [3, 'name must be atleast 3 characters'],
    maxLength: [30, 'name cannot be exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    validate: [validator.isEmail, 'email is invalid'],
    unique: [true, 'email already exist']
  },
  password: {
    type: String,
    required: [true, 'password is required'],
    minLength: [8, 'password must be atleast 8 characters']
  },
  avatar: {
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },
  role: {
    type: String,
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  resetPasswordToken:{type:String},
  resetPasswordExpire:{type:Date}
});


// hash password before save
UserSchema.pre("save", function(){
  this.password = bcrypt.hashSync(this.password, 10);
});

// generate jwt token
UserSchema.methods.getJwtToken = async function(){
  return await jwt.sign({id: this._id}, process.env.JWT_SECRET, {expiresIn: "7d"});
}

// compare password
UserSchema.methods.comparePassword = function(password){
  return bcrypt.compareSync(password, this.password)
}

// genrate reset password token
UserSchema.methods.getResetPasswordToken = function(){
  // generating token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hashing and storing to db
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // set tokem expiry
  this.resetPasswordExpire = Date.now + 15 * 60 * 1000;

  return resetToken;
}

module.exports = mongoose.model('User', UserSchema);