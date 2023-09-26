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
            
            res.stauts(209).json({message:'user already registered'})
        }
    } catch (error) {
        console.log(error,"errrprrr");
    }
}

module.exports={UserRegister,GoogleAuthRegister}