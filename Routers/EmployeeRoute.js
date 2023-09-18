const express=require("express")
const router=express.Router()
const uploadfile=require("../Middleware/multer")
const Employee=require("../Controller/employeeController")




router.post("/employee/register",uploadfile,Employee.EmployeeRegister)




module.exports=router;