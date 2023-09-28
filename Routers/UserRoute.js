const express=require('express')
const router=express.Router()

const User=require("../Controller/UserController")



router.post("/user/register",User.UserRegister)
router.post("/user/googleregister",User.GoogleAuthRegister)
router.post("/user/userlogin",User.UserLogin)
router.post("/user/googleauthlogin",User.GoogleAuthLogin)







module.exports=router;