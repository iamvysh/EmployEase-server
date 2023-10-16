const express=require("express")
const router=express.Router()
const uploadfile=require("../Middleware/multer")
const Employee=require("../Controller/employeeController")




router.post("/employee/register",uploadfile,Employee.EmployeeRegister)
router.post("/employee/login",Employee.EmployeeLogin)
router.get("/employee/newjobs/:id",Employee.NewJobmessages)
router.put("/employee/approvejobrequest",Employee.AcceptJobReqest)
router.delete("/employee/deletejobrequest/:employeeId/:requestId",Employee.DeleteJobRequest)
router.get("/employee/approvedjobrequest/:id",Employee.GetapprovedJob)
router.put("/employee/updatejobstatus/:id/:employeeid",Employee.CompleteJobrequiest)




module.exports=router;