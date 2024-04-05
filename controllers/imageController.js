const { asyncErrorHandler } = require("../middleware/catchAsyncError");
const Image = require("../models/carouselImages");
const ErrorHandler = require("../utils/errorHandler");
const cloudinary = require("cloudinary");

exports.uploadImage = asyncErrorHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: "carousel",
    width: 1000,
    crop: "scale",
  });
  let images = await Image.find({});
  if (images.length == 8) {
    return next(new ErrorHandler("Only 8 images can be uploaded", 400));
  }
  await Image.create({
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  // images = await Image.find({});
  res.status(200).json({
    success: true,
    // images,
  });
});
exports.allImages = asyncErrorHandler(async (req, res, next) => {
  images = await Image.find({});
  res.status(200).json({
    success: true,
    images,
  });
});
exports.deleteImage = asyncErrorHandler(async (req, res, next) => {
  console.log(req.body.public_id)
  await cloudinary.v2.uploader.destroy(req.body.public_id)
  await Image.findByIdAndDelete(req.body._id)
  res.status(200).json({
    success: true,
  });
});
