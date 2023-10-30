const User=require("../Model/UserModel")
const Job=require("../Model/JobModel")
const Razorpay=require("razorpay")
const crypto=require("crypto")



const UserRegister=async(req,res)=>{
    console.log(req.body)

    try {

        const {name,email,phonenumber,password}=req.body

        const newUser=await User.findOne({email:email})

        if(!newUser){

            const user=new User({
                name:name,
                email:email,
                phonemumber:phonenumber,
                password:password
            })
    
            await user.save()
    
            res.status(200).json({
                status:"success",
                message:"user registered succesfully"
            })
        }else{
                 return  res.status(205).json({
                    message:"already existing user"
                 })
        }

        
    } catch (error) {
        console.log(error);
    }
}

const GoogleAuthRegister=async(req,res)=>{

    console.log(req.body);

    try {
        
        const {email,displayName} = req.body;
    
        const existingUser = await User.findOne({email:email})
    
    
        if(!existingUser){
            const user = new User ({name:displayName,email:email});
            await user.save();
    
            
            res.status(201).json({message:'Account created successfully, Logging In'})
        }else{
            
          return  res.status(209).json({message:'user already registered'})
        }
    } catch (error) {
        console.log(error,"errrprrr");
    }
}

const UserLogin=async(req,res)=>{

    console.log(req.body);
    try {
        const {email,password}=req.body

        const user=await User.findOne({email:email})
        console.log("usererrfgr",user);
        if(!user){
            // console.log("hy");
          return res.status(203).json({
                status:"failed",
                message:"user not registered"
            })
        }
        if(user.password==password){
           return res.status(200).json({
                status:"success",
                message:"userloggin success full",
                Data:user._id
            })
        }else{
            return res.status(209).json({
                status:"failed",
                message:"incorrect password"
            })
        }
        
    } catch (error) {

        res.status(500).json({
            message:error
        })
        
    }
}


const GoogleAuthLogin=async(req,res)=>{
    try {
        console.log(req.body);
        const {email} = req.body;
    
        const existingUser = await User.findOne({email:email})
    
    
        if(!existingUser){
            
    
            
            res.status(203).json({message:'not a user,please registrer'})
        }else{
            
          return  res.status(200).json({message:'user loggin successfull',Data:existingUser._id})
        }
        
    } catch (error) {
        res.status(500).json({message:error})
        
    }
}

const Postjob=async(req,res)=>{
    try {
        const{userId,category,jobtitle,phonenumber,address,jobdescription,numberofemployees,place,Date,numberofdays}=req.body

        const newJob=new Job({
            userId:userId,
            jobtitle:jobtitle,
            category:category,
            phonenumber:phonenumber,
            address:address,
            jobdescription:jobdescription,
            numberofemployees:numberofemployees,
            place:place,
            Date:Date,
            numberofdays:numberofdays
        })

        await newJob.save()

        res.status(200).json({
            message:"job posted successfully"
        })
    } catch (error) {

        res.status(500).json({
            message:error
        })
        
    }
}

const UnapprovedJob=async(req,res)=>{
    const id=req.params.id

    console.log("user is isss",id);
    try {
        const jobs=await Job.find({userId:id,isApproved:false})

        if(jobs.length>0){
            res.status(200).json(
                {
                    message:"success",
                    Data:jobs
                }
            )
        }else{
            res.status(201).json({
                message:"no unapproved jobs"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error
        })
    }
}

const ApprovedJob=async(req,res)=>{
    const id=req.params.id

    console.log("user is isss",id);
    try {
        const jobs=await Job.find({userId:id,isApproved:true,isCompleted:false})

        if(jobs.length>0){
            res.status(200).json(
                {
                    message:"success",
                    Data:jobs
                }
            )
        }else{
            res.status(201).json({
                message:"no approved jobs"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error
        })
    }
}

const CompletedJob=async(req,res)=>{
    const id=req.params.id

    console.log("user is isss",id);
    try {
        const jobs=await Job.find({userId:id,isCompleted:true})

        if(jobs.length>0){
            res.status(200).json(
                {
                    message:"success",
                    Data:jobs
                }
            )
        }else{
            res.status(201).json({
                message:"no completed jobs"
            })
        }
    } catch (error) {
        res.status(500).json({
            message:"internal server error",
            error:error
        })
    }
}


const Paymenttoagency=async(req,res)=>{
    try {
     
      const instance=new Razorpay({
        key_id:process.env.key_id,
        key_secret:process.env.key_secret,
      })
  
      const options={
        
        amount:req.body.amount*100,
        currency:"INR",
        receipt:crypto.randomBytes(10).toString("hex")
      }
      
      instance.orders.create(options,(error,order)=>{
        if(error){
          console.log(error);
          return res.status(500).json({message:"Something Went ewrong"})
        }
        res.status(200).json({
          data:order
        })
      })
      
    } catch (error) {
      console.log("error",error)
      return res.status(500).json({message:"Internal server error"})
  
    }
  }

const Verifypayment=async(req,res)=>{
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
              req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
              .createHmac("sha256", process.env.KEY_SECRET)
              .update(sign.toString())
              .digest("hex");
  
        if (razorpay_signature === expectedSign) {
          return res.status(200).json({ message: "Payment verified successfully" });
        } else {
          return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error!" });
          console.log(error);
    }
} 


module.exports={UserRegister,GoogleAuthRegister,UserLogin,GoogleAuthLogin,Postjob,UnapprovedJob,ApprovedJob,CompletedJob,Paymenttoagency,Verifypayment}