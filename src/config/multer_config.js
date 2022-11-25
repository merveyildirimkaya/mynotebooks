const multer = require('multer')
const path = require('path')

const mystorage = multer.diskStorage({
    destination:(req,file,cb)=>{
      
        cb(null, path.join(__dirname,"../uploads/avatars"))
    },
    filename:(req,file,cb)=>{
     
        cb(null,`${req.user.email}${path.extname(file.originalname)}`)
    }
})

const myfileFilter = (req,file,cb)=>{
    if(file.mimetype == 'image/jpeg'  || file.mimetype =='image/png'){
       
        cb(null, true)
    }else{
       
        cb(null,false)
    }
}

const uploadImage = multer({storage:mystorage, fileFilter:myfileFilter})

module.exports= uploadImage