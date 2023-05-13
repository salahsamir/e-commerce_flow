
import CouponModel from "../../../../DB/model/Coupon.model.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";
import cloudinary from './../../../utils/cloudinary.js';

//get all categories except is deleted 
export const getAllCoupon=asyncHendeler(
    async(req,res,next)=>{

        const findCategories=await CouponModel.find({isDeleted:false})
         if(!findCategories.length){
             
             return next(new Error("Coupon empty",{cause:400}))
         }
     
       return res.status(200).json({message:"done",findCategories})
 }
)
export const getSpecificCoupon=asyncHendeler(
    async(req,res,next)=>{
    
        let{id}=req.params
       const findCategories=await CouponModel.findOne({_id:id,isDeleted:false})
        if(!findCategories){
            return next(new Error("Coupon  not exist",{cause:400}))

        }

      return res.status(200).json({message:"done",findCategories})
        
 
}
)
//add new Coupon 
export const CreateCoupon=asyncHendeler(
    async(req,res,next)=>{

   
        //distract name 
        const{name,expireDate}=req.body;
        //check if Coupon is exist or not 
        // console.log(new Date(expireDate).getTime(),new Date().getDate());
        if(new Date(expireDate).getTime()<=new Date().getTime()){
            return next(new Error("Date not valid",{cause:400}))
        }
        const findOne=await CouponModel.findOne({name})
        if(findOne){
            return next(new Error("name must be unique",{cause:409}))
        }
        //check image
        if(req.file){
            const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Coupon"})
            req.body.image={secure_url,public_id} 
        }
        const newCoupon=new CouponModel(req.body)
        await newCoupon.save()
        return res.status(201).json({message:"done",newCoupon})
}
)

export const UpdateCoupon=asyncHendeler(
    async(req,res,next)=>{
   
        let{id}=req.params;
        const find=await CouponModel.findOne({_id:id,isDeleted:false})
        if(!find){
            return next(new Error("Coupon not exist",{cause:400}))
        }
        
      if(req.body.name){
        if(await CouponModel.findOne({name:req.body.name})){
            return next(new Error("name must be unique",{cause:409}))
        }
      }
      if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Category"})
        req.body.image={secure_url,public_id}
      }
      const findOne=await CouponModel.updateOne(req.body)
      
      return res.status(200).json({message:"done",findOne})
 
}
)

export const DeleteCoupon=asyncHendeler(
    async(req,res,next)=>{
        let{id}=req.params;
        const findOne=await CouponModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
        if(!findOne){
            return next(new Error("Coupon not exist",{cause:400}))
        }
      return res.status(200).json({message:"done",findOne})    
}
)