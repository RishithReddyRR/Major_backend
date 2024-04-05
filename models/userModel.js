const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "enter your name please"],
    // minLength: [4, "your name length should be minimum 4"],
    // maxlength: [40, "Your name length should not exceed 40"],
  },
  email: {
    type: String,
    // required: [true, "please enter your email"],
    // validate: [validator.isEmail, "enter correct email address"],
    // unique: true,
  },
  password: {
    type: String,
    select: false,
    // required: [true, "please enter password"],
    // minLength: [8, "your password should have minimum 8 charactors"],
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  description: String,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  gsProfile: String,
  gsCitations: Number,
  gsHIndex: Number,
  wosProfile: String,
  wosCitations: Number,
  wosHIndex: Number,
  scopusCitations: Number,
  scopusHIndex: Number,
  scopusProfile: String,
  vidwanProfile: String,
  vidwanScore: Number,
  dob: String,
  education: [String],
  socialProfiles: [{ name: String, link: String }],
  city: String,
  department: String,
});
//encrypting password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  console.log("in encr")
  this.password = await bcrypt.hash(this.password, 10);
});

//generating token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
//comparing password

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  // Generating Token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hashing and adding resetPasswordToken to userSchema
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("user", userSchema);
