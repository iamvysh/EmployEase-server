const employee=require("../Model/EmployeeModel")
const cloudinary=require("../cloudinary/cloudinary")
const Path = require('path')
const fs = require('fs')

const EmployeeRegister = async (req, res) => {
    console.log(req.body);
    
    try {
        let pdfUrls = []; // Array to store PDF URLs
        let jpgUrls = []; // Array to store JPG URLs
        const {name,phonenumber,email,password,gender,address,pincode,state,skills,Aadharnumber} = req.body;
        
        // console.log(name,phonenumber,email,password,gender,address,pincode,state,skills,);
        
        const uploader = async (path) => await cloudinary.uploads(path, "imagefile");
        console.log("req files",req.files);
        const docs = req.files;
        console.log("docs :",docs)
        for (const file of docs) {
            const { path } = file;
            console.log("path from multer :",path);
            const newPath = await uploader(path);
            console.log("newPath",newPath.url);
            const fileExtension = Path.extname(newPath.url); // Get file extension
            console.log("fileextention",fileExtension);
            if (fileExtension == '.pdf') {
                pdfUrls.push(newPath.url);
            } else  {
                jpgUrls.push(newPath.url);
            }
            fs.unlinkSync(path)

        }
        const image=jpgUrls[0]
        const certifiacte=pdfUrls[0]

        console.log("cloud image url :",image);
        console.log("clould pdf url :",certifiacte);

        // const response = {
        //     message: "Data successfully received",
        //     pdf: certifiacte,
        //     jpg:image 
        // };

        // res.status(200).send(response);


        const Employee=new employee({
            name:name,
            phonenumber:phonenumber,
            email:email,
            password:password,
            gender:gender,
            address:address,
            pincode:pincode,
            state:state,
            imagefile:image,
            pcccertificate:certifiacte,
            skills:skills,
            Aadharnumber:Aadharnumber

        })
        await Employee.save()

        res.status(200).json({
            status :'success',
            message:" employee registred successfully"
    
        })
    } catch (err) {
        res.status(405).json({

            status:'failed to register',
            message:err.message
             })
    }
}

const EmployeeLogin=async(req,res)=>{

    try {
        const {id,password}=req.body
        
        console.log(id,password);
           // Find the employee by _id and check if isApproved is true
    const Employee = await employee.findOne({ _id:id, isApproved: true });

    if (!employee) {
      return res.status(401).json({ message: 'Invalid credentials or not approved.' });
    }

    // Check if the provided password matches the stored password
    if (Employee.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials or not approved.' });
    }

    // Authentication successful
    res.status(200).json({ 
        message: 'Login successful',
        Data:Employee
                                 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports={EmployeeRegister,EmployeeLogin}