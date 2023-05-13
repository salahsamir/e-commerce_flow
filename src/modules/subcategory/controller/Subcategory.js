
import categoryModel from "../../../../DB/model/Category.model.js";
import SubCategoryModel from "../../../../DB/model/SubCategory.model.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";
import cloudinary from './../../../utils/cloudinary.js';

//get all categories except is deleted 
export const getAllSubCategory=asyncHendeler(
    async(req,res,next)=>{
    
        const findSubCategories=await SubCategoryModel.find({isDeleted:false})
         if(!findSubCategories.length){
             
             return next(new Error("subCategory empty",{cause:400}))
         }
     
       return res.status(200).json({message:"done",findSubCategories})
         
   
 }
)
export const getSpecificSubCategory=asyncHendeler(
    async(req,res,next)=>{
    
        let{id}=req.params
       const findCategories=await SubCategoryModel.findOne({_id:id,isDeleted:false})
        if(!findCategories){
            return next(new Error("subCategory  not exist",{cause:400}))

        }

      return res.status(200).json({message:"done",findCategories})
        
 
}
)
// //add new category 
export const CreateSubCategory=asyncHendeler(
    async(req,res,next)=>{
        //distract name 
        const{category}=req.params;
        const findOne=await categoryModel.findOne({category})
        if(!findOne){
            return next(new Error("category not found ",{cause:400}))
        }
        req.body.category=category
        //check image
        if(!req.file){
            return next(new Error("image  required",{cause:400}))
        }
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Category"})
        req.body.image={secure_url,public_id}
        const newCategory=new SubCategoryModel(req.body)
        await newCategory.save()
        return res.status(201).json({message:"done",newCategory})
        
  
}
)

export const UpdateSubCategory=asyncHendeler(
    async(req,res,next)=>{
   
        let{id}=req.params;
        const findOne=await SubCategoryModel.findOne({_id:id,isDeleted:false})
        if(!findOne){
           
            return next(new Error("subcategory not exist",{cause:400}))

        }
        
      if(req.body.name){
        if(await SubCategoryModel.findOne({name:req.body.name})){
           
            return next(new Error("name must be unique",{cause:409}))

        }
        findOne.name=req.body.name
      }
      if(req.file){
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.file.path,{folder:"Category"})
        findOne.image={secure_url,public_id}
      }
      
      await findOne.save()
      return res.status(200).json({message:"done",findOne})
 
}
)

export const DeleteSubCategory=asyncHendeler(
    async(req,res,next)=>{
        let{id}=req.params;
        const findOne=await SubCategoryModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
        if(!findOne){
            return next(new Error("Category not exist",{cause:400}))
        }
      return res.status(200).json({message:"done",findOne})    
}
)