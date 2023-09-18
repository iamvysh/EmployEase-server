const express=require("express")

const router=express.Router()
const Agency=require("../Controller/agencyController")


router.post ("/agency/register",Agency.AgencyRegister)
router.post("/agency/login",Agency.agencyLogin)



module.exports=router;