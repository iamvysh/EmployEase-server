const express=require("express")

const router=express.Router()
const Agency=require("../Controller/agencyController")


router.post ("/agency/register",Agency.AgencyRegister)
router.post("/agency/login",Agency.agencyLogin)
router.get("/agency/unapprovedemployees",Agency.UnapprovedEmployees)
router.get("/agency/getunapprovedemployee/:id",Agency.UnApprovedEmployee)
router.delete("/agency/deleteunapprovedemployee/:id",Agency.DeleteAunapprovedEmployee)
router.put("/agency/updateunapprovedemployee/:id",Agency.approveEmployeeById)


module.exports=router;