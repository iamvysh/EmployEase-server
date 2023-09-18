const agency=require("../Model/AgencyModel")



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


module.exports = {AgencyRegister,agencyLogin}