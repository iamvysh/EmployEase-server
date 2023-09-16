const multer=require("multer")
const path=require("path")

const imageStorage=multer.diskStorage({
  destination:(req,file,callback)=>{
      console.log("multer ")
        callback(null,"uploads/images/")
    },
    filename:(req,file,callback)=>{
        const ext=path.extname(file.originalname)
        callback(null,Date.now()+ext);
    }
})

// Set up multer storage for certificate file
const certificateStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/certificates/"); 
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, Date.now() + ext);
    },
  });

  const uploadImage = multer({ storage: imageStorage }).array("imagefile",2);
const uploadCertificate = multer({ storage: certificateStorage }).single("pcccertificate");

module.exports=uploadImage;