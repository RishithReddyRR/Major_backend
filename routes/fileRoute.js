const express=require('express')
let multer=require('multer')
let {uploadConferences, uploadJournals, uploadBookChapter, uploadPublications, uploadUsers}=require("../controllers/fileUploadController")
let storage=multer.diskStorage(
    {
        destination:(req,file,cb)=>cb(null,'./upload'), 
        filename:(req,file,cb)=>cb(null,file.originalname)
    }
)
const upload=multer({storage})
const router=express.Router()
// router.post("/conference",upload.single('file'),uploadConferences)
// router.post("/journal",upload.single('file'),uploadJournals)
// router.post("/book-chapter",upload.single('file'),uploadBookChapter)
router.post("/publications",upload.single('file'),uploadPublications)
router.post('/create-users',upload.single('file'),uploadUsers);


module.exports=router