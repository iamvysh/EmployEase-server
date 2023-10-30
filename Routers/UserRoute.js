const express=require('express')
const router=express.Router()

const User=require("../Controller/UserController")



router.post("/user/register",User.UserRegister)
router.post("/user/googleregister",User.GoogleAuthRegister)
router.post("/user/userlogin",User.UserLogin)
router.post("/user/googleauthlogin",User.GoogleAuthLogin)
router.post("/user/postjob",User.Postjob)
router.get("/user/unapprovedjob/:id",User.UnapprovedJob)
router.get("/user/approvedjobs/:id",User.ApprovedJob)
router.get("/user/completedjobs/:id",User.CompletedJob)
router.post("/user/payment",User.Paymenttoagency)
router.post("/user/verifypayment/agency",User.Verifypayment)






module.exports=router;