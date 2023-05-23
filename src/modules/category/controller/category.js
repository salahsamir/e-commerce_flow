import categoryModel from "../../../../DB/model/Category.model.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";
import cloudinary from './../../../utils/cloudinary.js';

//get all categories except is deleted 
export const getAllCategory=asyncHendeler(
    async(req,res,next)=>{
    
        const data=await categoryModel.find({isDeleted:false}).populate({path:"SubCategory",select:"name image -category -_id"})
         if(!data.length){
             
             return next(new Error("Category empty",{cause:400}))
         }
     
       return res.status(200).json({message:"success",data})
         
   
 }
)
export const getSpecificCategory=asyncHendeler(
    async(req,res,next)=>{
    
        let{id}=req.params
       const data=await categoryModel.findOne({_id:id,isDeleted:false}).populate({path:"SubCategory",select:"name image -category -_id"})
        if(!data){
            return next(new Error("Category  not exist",{cause:400}))

        }

      return res.status(200).json({message:"success",data})
        
 
}
)
//add new category 
export const CreateCategory=asyncHendeler(
    async(req,res,next)=>{
      const {_id}=req.user._id
      req.body.createdBy=_id
    
        //distract name 
        const{name}=req.body;
        //check if category is exist or not 
        const findOne=await categoryModel.findOne({name})
        if(findOne){
           
            return next(new Error("name must be unique",{cause:409}))

        }
        //check image
        if(!req.file){
           
            return next(new Error("image  required",{cause:400}))
            
        }
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Category"})
        req.body.image={secure_url,public_id}
        const newCategory=new categoryModel(req.body)
        await newCategory.save()
        return res.status(201).json({message:"done",newCategory})
        
  
}
)

export const UpdateCategory=asyncHendeler(
    async(req,res,next)=>{
        const {_id}=req.user._id
        
        let{id}=req.params;
        const findOne=await categoryModel.findOne({_id:id,isDeleted:false})
        if(!findOne){
           
            return next(new Error("category not exist",{cause:400}))

        }
        
      if(req.body.name){
        if(await categoryModel.findOne({name:req.body.name})){
           
            return next(new Error("name must be unique",{cause:409}))

        }
        findOne.name=req.body.name
      }
      if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Category"})
        findOne.image={secure_url,public_id}
      }
      findOne.updatedBy=_id
      await findOne.save()
      return res.status(200).json({message:"done",findOne})
 
}
)

export const DeleteCategory=asyncHendeler(
    async(req,res,next)=>{
        let{id}=req.params;
        const findOne=await categoryModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
        if(!findOne){
            return next(new Error("Category not exist",{cause:400}))
        }
      return res.status(200).json({message:"done",findOne})    
}
)