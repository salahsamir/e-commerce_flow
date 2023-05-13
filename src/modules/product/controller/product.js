import { asyncHendeler } from "../../../utils/errorHandling.js";
import SubCategoryModel from './../../../../DB/model/SubCategory.model.js';
import brandModel from './../../../../DB/model/Brand.model.js';
import productModel from "../../../../DB/model/Product.model.js";
import cloudinary from './../../../utils/cloudinary.js';
import userModel from "../../../../DB/model/User.model.js";
export const getAllproduct=asyncHendeler(
    async(req,res,next)=>{
        const products=await productModel.find({isDeleted:false}).populate({path:"reviews"})
        return res.status(200).json({message:"done",products})
    }
)

export const getSpecificproduct=asyncHendeler(
    async(req,res,next)=>{
        const{id}=req.params
        const product=await productModel.find({_id:id,isDeleted:false}).populate({path:"reviews"})
        return product? res.status(200).json({message:"done",product}):next(new Error("in-valid id",{cause:400}))
    }
)
export const Createproduct=asyncHendeler(
    async(req,res,next)=>{
        const {brand,subcategory,category,name,price,discount}=req.body
        if(!await SubCategoryModel.findOne({_id:subcategory,category})){
            return next(new Error("subcategory not exist",{cause:400}))
        }
        if(!await brandModel.findOne({_id:brand})){
            return next(new Error("brand not exist",{cause:400}))
        }
        console.log(Number.parseFloat(price-(price*((discount||0)/100))).toFixed(2));
        req.body.totalprice=Number.parseFloat(price-(price*((discount||0)/100))).toFixed(2)
        const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,{folder:`product`})
        req.body.main_image={secure_url,public_id};
        if(req.files.images){
            req.body.images=[]
            for (const file of req.files.images) {
                const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`product/subimages`})
                req.body.images.push({secure_url,public_id})
            }
        }
        req.body.createdBy=req.user._id
        const create =new productModel(req.body)
        await create.save()
        return res.status(201).json({message:"done",create})
    }
)
export const Updateproduct=asyncHendeler(
    async(req,res,next)=>{
        const {id}=req.params;
        const{name,price,discount}=req.body;

        const find_product=await productModel.findOne({_id:id,isDeleted:false})
        if(!find_product){
            return next (new Error('this product not found',{cause :409}))
        }
        req.body.totalprice=(price||discount)?Number.parseFloat((price||find_product.price)-((price||find_product.price)*((discount||find_product.discount)/100))).toFixed(2):Number.parseFloat(price-(price*((discount)/100))).toFixed(2)
        if(req.files?.image.length){
            const {secure_url,public_id}=await cloudinary.uploader.upload(req.files.image[0].path,{folder:`product`})
            req.body.main_image={secure_url,public_id};
        }
    
       
        if(req.files?.images.length){
            req.body.images=[]
            for (const file of req.files.images) {
                const {secure_url,public_id}=await cloudinary.uploader.upload(file.path,{folder:`product/subimages`})
                req.body.images.push({secure_url,public_id})
            }
        }
        req.body.updatedBy=req.user._id
         const updated= await productModel.findByIdAndUpdate(id,req.body,{new:true})
        
         return res.status(200).json({message:"done",updated})

    }
)
export const Deleteproduct=asyncHendeler(
    async(req,res,next)=>{
        const{id}=req.params
    
        const product=await productModel.findOneAndUpdate({_id:id,isDeleted:false},{isDeleted:true},{new:true})
        return product? res.status(200).json({message:"done",product}):next(new Error("in-valid id",{cause:400}))
    }
)

export const wishList=asyncHendeler(

async(req,res,next)=>{
    const {product}=req.params;
    if(! await productModel.findById(product)){
        return next (new Error("in-valid product"))
    }
    const check_wish=await userModel.findOne({_id:req.user.id,wishList :{$in:product}})
    let result
    if(check_wish){
     result=await userModel.findOneAndUpdate({_id:req.user.id},{$pull :{wishList:product}})

    }else{
    result=await userModel.findOneAndUpdate({_id:req.user.id},{$addToSet:{wishList:product}})

    }

    return res.status(200).json({message:"done",result})
   

}

)