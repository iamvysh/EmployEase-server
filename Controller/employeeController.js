const employee=require("../Model/EmployeeModel")
const cloudinary=require("../cloudinary/cloudinary")


const EmployeeRegister=async(req,res)=>{

    console.log(req.body)
    console.log(req.files)

try{
    let urls= []
    const {username,phone,email,password,address}=req.body

    const uploader=async (path)=>await cloudinary.uploads(path,"imagefile")
    const files=req.files;

    for (const file of files){
        const{path}=file

        const newPath=await uploader(path)
        urls.push(newPath)

        console.log(newPath);

        
    }
     res.status(200).send("data successfully received",urls)


    }catch(err){

        res.status(405).send("error",err)

    }
}

module.exports={EmployeeRegister}