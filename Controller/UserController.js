const User=require("../Model/UserModel")
const Job=require("../Model/JobModel")



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
        const{userId,jobtitle,phonenumber,address,jobdescription,numberofemployees,place}=req.body

        const newJob=new Job({
            userId:userId,
            jobtitle:jobtitle,
            phonenumber:phonenumber,
            address:address,
            jobdescription:jobdescription,
            numberofemployees:numberofemployees,
            place:place
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



module.exports={UserRegister,GoogleAuthRegister,UserLogin,GoogleAuthLogin,Postjob}