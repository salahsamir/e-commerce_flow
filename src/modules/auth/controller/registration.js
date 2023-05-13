import userModel from "../../../../DB/model/User.model.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";
import { compare, hash } from './../../../utils/HashAndCompare.js';
import sendEmail from './../../../utils/email.js';


export const signup=asyncHendeler(
    async(req,res,next)=>{
        const {email,password}=req.body 
        if(await userModel.findOne({email})){
            return next(new Error("this email is used before" ,{cause:409}))
        }
       
        const token=generateToken({payload:{email}})
        const link=`${req.protocol}://${req.headers.host}/auth/confirem/${token}`
        const send=await sendEmail({to:email,subject:"confirem email",html:`<a href=${link}>click here to confirem your email</a>`})
      if(!send){
        return next(new Error("some thing wrong " ,{cause:409}))

      }
        const hashPassword=hash({plaintext:password})
        req.body.password=hashPassword
        const user=await userModel.create(req.body)
        return res.status(201).json({message:"done please confirem email"})

    }
)
export const confirmEmail=asyncHendeler(async(req,res,next)=>{
    const {token}=req.params
    const {email}=verifyToken({token})
    const confirem=await userModel.findOneAndUpdate({email},{confirmEmail:true},{new:true})
    return res.status(200).json({message:"done",confirem})
})
export const signin=asyncHendeler(
  async(req,res,next)=>{
    const{email,password}=req.body
    const checkEmail=await userModel.findOne({email,confirmEmail:true})
    if(!checkEmail){
      return next(new Error("in-valid email please check email",{cause:409}))
    }
 
    if(!compare({plaintext:password,hashValue:checkEmail.password})){
      return next(new Error(" please check your password",{cause:400}))

    }
   
    const token=generateToken({payload:{id:checkEmail._id}})
    checkEmail.active=true
    await checkEmail.save()
    
    return res.status(200).json({message:"done",token})
  }
)

export const forgetpassword=asyncHendeler(
  async(req,res,next)=>{
    const {email}=req.body
    const checkEmail=await userModel.findOne({email,confirmEmail:true})
    if(!checkEmail){
      return next(new Error("in-valid email please check email",{cause:409}))
    }
    const code=Math.floor(Math.random()*10000)
    const token=generateToken({payload:{email,code}})
    const link=`${req.protocol}://${req.headers.host}/auth/change/${token}`
         const send=await sendEmail({to:email,html:`<a href=${link}>${code}</a>`,subject:'get code'})
        if(!send){
            return next(new Error('invalid token',{cause:400}))
        }
     return res.status(200).json({message:"done please write code",token})

  }
)
export const changepassword=asyncHendeler(
  async(req,res,next)=>{
   
    const{code,email}=verifyToken({token:req.params.token})
    if(code!=req.body.code){
      return next(new Error('please write right code ',{cause:400}))

    }
    const hashpassword=hash({plaintext:req.body.password})
    const update=await userModel.findOneAndUpdate({email},{password:hashpassword},{new:true})
    return res.status(200).json({message:"done",update})
  }
)