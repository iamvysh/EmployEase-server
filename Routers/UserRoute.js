const express=require('express')
const router=express.Router()

const User=require("../Controller/UserController")



router.post("/user/register",User.UserRegister)
router.post("/user/googleregister",User.GoogleAuthRegister)







module.exports=router;