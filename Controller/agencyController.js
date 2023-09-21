const agency=require("../Model/AgencyModel")
const employees=require("../Model/EmployeeModel")
const { sendSMS } = require('../Twilio/Twili')


const   AgencyRegister=async(req,res)=>{

 console.log(req.body);
 

 try {

    const {username,email,password}=req.body


    const Agency= new agency({
        username:username,
        email:email,
        password:password
    })
    await Agency.save()

    res.status(200).json({
        status:'success',
        message:"agency registered successfully"
    })
    
 } catch (error) {

    res.status(405).json({
        status:'failed to register',
        message:error.message
    })
    
 }
  



}
const agencyLogin=async(req,res)=>{

    console.log(req.body);
    try {

        const {email,password}=req.body

        // Get the agency account from the database.
        const Agency = await agency.findOne({email:email})

        // If the agency account does not exist, 
        if (!Agency) {
            return res.status(404).json({
                status: "failed",
                message: "Agency account does not exist."
            })
        }

        

        // If the password is incorrect,
        if (password !== Agency.password) {
            return res.status(401).json({
                status: "failed",
                message: "Password incorrect."
            })
        }

        // If the agency account is valid,
        return res.status(200).json({
            status: "success",
            message: "Agency signed in successfully."
        })

    } catch (error) {
        
        res.status(500).json({
            status:"internal server error",
            message:error.message
        })
    }
}

const UnapprovedEmployees=async(req,res)=>{

    try {

        const AllunApprovedEmployees= await employees.find({isApproved:false})

        if( AllunApprovedEmployees.length>0){
            res.status(200).json({
                status:"success",
                Data:AllunApprovedEmployees
            })
        }else{
            res.status(205).json({
                status:"success",
                message:"no new request"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            status:"internal server error",
            message:error.message
        })
        
    }

}

const UnApprovedEmployee=async(req,res)=>{
    try {
        const {id}=req.params
        console.log(id)
        const Employee=await employees.findOne({_id:id})

        if(Employee){
            return res.status(200).json({
                status:"success",
                Data:Employee
            })
        }else{
            return res.status(205).json({
                status:"success",
                message:"no employee found"
            })
        }
        
    } catch (error) {
        res.status(500).json({
            status:"internal server error",
            message:error.message
        })
        
    }
}

const DeleteAunapprovedEmployee=async(req,res)=>{
    try {
        const {id}=req.params
        const Employee=await employees.findByIdAndDelete({_id:id})
        
        if(Employee){
            return res.status(200).json({
                status:"success",
                message:"employee deleted successfully"
            })
        }else{
            return res.status(205).json({
                status:"failure",
                message:"no employee found"
            })
        }

    } catch (error) {
        
        res.status(500).json({
            status:"internal server error",
            message:error.message
        })

    }
}

const approveEmployeeById = async (req, res) => {
    try {
      const { id } = req.params; 
  
      
      const employee = await employees.findByIdAndUpdate(
        id,
        { isApproved: true },
        { new: true } 
      );
  
      if (!employee) {
        return res.status(405).json({ message: 'Employee not found' });
      }

      // Check if isApproved is true, and if so, send an SMS
    if (employee.isApproved) {
        // const number=`+91${employee.phonenumber}`
        // const number="+918921358370"
        const number = "+91" + employee.phonenumber;
        console.log(number);
        const message = `Dear ${employee.name}......Your employee account has been approved. Welcome to EmployEase!`
        await sendSMS(number, message);
      }
  
      res.status(200).json({ message: 'Employee approved successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = {AgencyRegister,agencyLogin,UnapprovedEmployees,UnApprovedEmployee,DeleteAunapprovedEmployee,approveEmployeeById}