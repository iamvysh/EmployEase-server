const cloudinary = require('cloudinary')

const dotenv = require('dotenv')

dotenv.config()

cloudinary.config({

    cloud_name  : "dzexnrzh9",
      api_key   :"838443939622851" ,
      api_secret:"4SFTPBccCTrdcnxscSGclAyg1xw"

})

console.log(process.env.cloud_name);

exports.uploads =(file,folder)=>{

    return new Promise(resolve =>{
        cloudinary.uploader.upload(file,(result)=>{
          console.log("clodinary result",result)
            resolve({
               url:result.url,
                //  id:result.public_id 
                })
            },{

            resourse_type : "auto",
            folder:folder
          })

     })
       
}