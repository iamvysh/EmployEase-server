const express=require("express")

const router=express.Router()
const Agency=require("../Controller/agencyController")


router.post ("/agency/register",Agency.AgencyRegister)
router.post("/agency/login",Agency.agencyLogin)
router.get("/agency/unapprovedemployees",Agency.UnapprovedEmployees)
router.get("/agency/getunapprovedemployee/:id",Agency.UnApprovedEmployee)
router.delete("/agency/deleteunapprovedemployee/:id",Agency.DeleteAunapprovedEmployee)
router.put("/agency/updateunapprovedemployee/:id",Agency.approveEmployeeById)
router.get("/agency/approvedemployees",Agency.getGetAllapprovedEmployees)
router.get("/agency/getallusers",Agency.GetAllUsers)
router.get("/agency/unapprovedjobs",Agency.GetAllUnapprovedJobs)
router.get("/agency/getuserbyid/:id",Agency.GetJobbyId)
router.put("/agency/sendjobrequesttoemployees",Agency.SendJobMessageToEmployees)





router.get("/agency/jobs/getsimileremployees/:id",Agency.GetSimilerEmployees)


module.exports=router;