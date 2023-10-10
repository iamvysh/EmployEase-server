const mongoose=require("mongoose")



const jobSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
        
    },
    jobtitle:{
        type:String
    },
    category:{
        type:String,
        required:true
    },
    phonenumber:{
        type:Number
    },
    numberofemployees:{
        type:Number
    },
    place:{
        type:String
    }
    ,
    address:{
        type:String
    },
    jobdescription:{
        type:String
    },
    isApproved:{
        type:Boolean,
        default:false
    },
    scheduledemployees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Employee",
    }],
    Date: {  
        type: Date,  
        required:true
      },
      numberofdays: {  
        type: Number,  
        default: 1,
      },
})

const Job=mongoose.model("Job",jobSchema)

module.exports=Job