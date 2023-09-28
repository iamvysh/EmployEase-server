const User=require("../Model/UserModel")



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
                message:"userloggin success full"
            })
        }else{
            return res.status(209).json({
                status:"failed",
                message:"incorrect password"
            })
        }
        
    } catch (error) {

        console.log(error);
        
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
            
          return  res.status(200).json({message:'user loggin successfull'})
        }
        
    } catch (error) {
        console.log(error)
        
    }
}



module.exports={UserRegister,GoogleAuthRegister,UserLogin,GoogleAuthLogin}