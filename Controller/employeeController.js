const employee=require("../Model/EmployeeModel")
const cloudinary=require("../cloudinary/cloudinary")
const Path = require('path')


const EmployeeRegister = async (req, res) => {
    console.log(req.body);

    try {
        let pdfUrls = []; // Array to store PDF URLs
        let jpgUrls = []; // Array to store JPG URLs
        const {name,phonenumber,email,password,gender,address,pincode,state,skills} = req.body;

        console.log(name,phonenumber,email,password,gender,address,pincode,state,skills);

        const uploader = async (path) => await cloudinary.uploads(path, "imagefile");
        const files = req.files;

        for (const file of files) {
            const { path } = file;
            // console.log(path);
            const newPath = await uploader(path);
            console.log(newPath.url);
            const fileExtension = Path.extname(newPath.url); // Get file extension
            console.log(fileExtension);
            if (fileExtension == '.pdf') {
                pdfUrls.push(newPath.url);
            } else if (fileExtension == '.png') {
                jpgUrls.push(newPath.url);
            }
        }
        const image=jpgUrls[0]
        const certifiacte=pdfUrls[0]

        console.log(image);
        console.log(certifiacte);

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
            skills:skills

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
};

module.exports={EmployeeRegister}