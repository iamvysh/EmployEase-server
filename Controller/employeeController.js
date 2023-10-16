const employee=require("../Model/EmployeeModel")
const cloudinary=require("../cloudinary/cloudinary")
const Path = require('path')
const fs = require('fs')
const Job=require("../Model/JobModel")

const EmployeeRegister = async (req, res) => {
    console.log(req.body);
    
    try {
        let pdfUrls = []; // Array to store PDF URLs
        let jpgUrls = []; // Array to store JPG URLs
        const {name,phonenumber,email,password,gender,address,pincode,state,category,Aadharnumber} = req.body;
        
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
            category:category,
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
                                 zon
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const NewJobmessages=async(req,res)=>{
    try {
        const id=req.params.id

        const EmployeeDetails=await employee.findById(id).populate("newRequest")

        res.status(200).json({
            message:"success",
            Data:EmployeeDetails.newRequest
        })
    } catch (error) {
        res.status(500).json({
            message:"failed",
            data:error
        })
    }
}

// ********************trespassers will be prosecuted**********************

const AcceptJobReqest = async (req, res) => {
    try {
      const { job_id, employee_id } = req.body;
  
      // Check if the employee is already scheduled for the job
      const job = await Job.findOne({ _id: job_id, scheduledemployees: employee_id });
  
      if (job) {
        return res.status(203).json({
          message: "Employee is already scheduled for this job",
        });
      }
  
      // If not, push the employee_id to scheduledemployees
      const updatedJob = await Job.findOneAndUpdate(
        { _id: job_id },
        { $push: { scheduledemployees: employee_id } },
        { new: true }
      );

      const updatedEmployee=await employee.findByIdAndUpdate(
        employee_id,
      { $pull: { newRequest: job_id } },
      { new: true }
      )
  
      res.status(200).json({
        message: "Successful",
        updatedJob,
        updatedEmployee
      });
    } catch (error) {
      res.status(500).json({
        message: "Error",
        error: error.message,
      });
    }
  };
  
// ********************trespassers will be prosecuted**********************


const DeleteJobRequest=async(req,res)=>{
    try {

        const employeeId = req.params.employeeId; 
        const requestIdToRemove = req.params.requestId;

        const result = await employee.findByIdAndUpdate(
            employeeId,
            {
              $pull: { newRequest: requestIdToRemove },
            },
            { new: true } 
          );
      
          if (!result) {
            return res.status(404).json({ error: "Employee not found" });
          }
      
          return res.status(200).json({ message: "Request ID removed successfully" });
        
    } catch (error) {

        res.status(500).json({
            message:"internal server error",
            error:error
        })
        
    }
}


// ********************trespassers will be prosecuted**********************

const GetapprovedJob=async(req,res)=>{
  try {
    const id=req.params.id
    console.log(id);

    const jobdetails=await employee.findOne({_id:id}).populate("approvedRequest")

    if(!jobdetails){
     return res.status(404).json({
        message:"no employee found"
      })
    }
    res.status(200).json({
      message:"success",
      Data:jobdetails
    })
    
  } catch (error) {
    res.status(500).json({
      message:"server error",
      data:error
    })
  }
}


const CompleteJobrequiest=async(req,res)=>{
  try {
    const jobId = req.params.id;
    const employeeId = req.params.employeeid; 

    // Find the employee by their ID and update the completedRequest and approvedRequest fields
    const updatedEmployee = await employee.findOneAndUpdate(
      { _id: employeeId },
      {
        $pull: { approvedRequest: jobId }, // Remove jobId from approvedRequest
        $push: { completedRequest: jobId }, // Add jobId to completedRequest
        isActive: false, // Set isActive to false

      },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Update the job's isCompleted to true
    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      { isCompleted: true },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: 'Job not found' });
    }

    return res.status(200).json({ message: 'Job marked as completed', Data: updatedJob });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}




module.exports={EmployeeRegister,EmployeeLogin,NewJobmessages,AcceptJobReqest,DeleteJobRequest,GetapprovedJob,CompleteJobrequiest}