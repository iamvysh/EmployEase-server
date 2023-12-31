const mongoose=require("mongoose")



const EmployeeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    Aadharnumber:{
        type:String,
        required:true
    },
    gender:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    pincode:{
        type:Number
    },
    state:{
        type:String,
        required:true
    },
    imagefile:{
        type:String,
        required:true
    },
    pcccertificate:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true,
    }, 
    isApproved: {
        type: Boolean,
        default: false, 
    },
    isActive:{
        type:Boolean,
        default:false,
    },
    newRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    }],
    approvedRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    }],
    completedRequest:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Job"
    }],


})

const Employee=mongoose.model('Employee',EmployeeSchema)

module.exports=Employee