
import { asyncHendeler } from "../../../utils/errorHandling.js";
import cloudinary from './../../../utils/cloudinary.js';
import brandModel from './../../../../DB/model/Brand.model.js';

//get all categories except is deleted 
export const getAllbrand=asyncHendeler(
    async(req,res,next)=>{
    
        const findBrand=await brandModel.find({isDeleted:false})
         if(!findBrand.length){
             
             return next(new Error("Category empty",{cause:400}))
         }
     
       return res.status(200).json({message:"done",findBrand})
         
   
 }
)
export const getSpecificbrand=asyncHendeler(
    async(req,res,next)=>{
    
        let{id}=req.params
       const findbrands=await brandModel.findOne({_id:id,isDeleted:false})
        if(!findbrands){
            return next(new Error("brand  not exist",{cause:400}))

        }

      return res.status(200).json({message:"done",findbrands})
        
 
}
)
//add new category 
export const Createbrand=asyncHendeler(
    async(req,res,next)=>{
   
        //distract name 
        const{name}=req.body;
        //check if category is exist or not 
        const findOne=await brandModel.findOne({name})
        if(findOne){
           
            return next(new Error("name must be unique",{cause:400}))

        }
        //check image
        if(!req.file){
           
            return next(new Error("image  required",{cause:400}))
            
        }
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"brand"})
        req.body.logo={secure_url,public_id}
        req.body.createdBy=req.user._id
        const newbrand=new brandModel(req.body)
        await newbrand.save()
        return res.status(201).json({message:"done",newbrand})
        
  
}
)

export const Updatebrand=asyncHendeler(
    async(req,res,next)=>{
   
        let{id}=req.params;
        const findOne=await brandModel.findOne({_id:id,isDeleted:false})
        if(!findOne){
           
            return next(new Error("brand not exist",{cause:400}))

        }
        
      if(req.body.name){
        if(await brandModel.findOne({name:req.body.name})){
           
            return next(new Error("name must be unique",{cause:400}))

        }
        findOne.name=req.body.name
      }
      if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"brand"})
        findOne.logo={secure_url,public_id}
      }
      findOne.updatedBy=req.user._id
      await findOne.save()
      return res.status(200).json({message:"done",findOne})
 
}
)

export const Deletebrand=asyncHendeler(
    async(req,res,next)=>{
        let{id}=req.params;
        const findOne=await brandModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
        if(!findOne){
            return next(new Error("brand not exist",{cause:400}))
        }
      return res.status(200).json({message:"done",findOne})    
}
)