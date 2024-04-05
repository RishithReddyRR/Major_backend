const express=require('express');
const { uploadImage, allImages, deleteImage } = require('../controllers/imageController');
const { isAuthenticatedUser } = require('../middleware/auth');
const router=express.Router()

router.post("/upload",uploadImage)
router.get("/get",allImages)
router.post("/delete",deleteImage)







module.exports=router