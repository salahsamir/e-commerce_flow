import reviewModel from "../../../../DB/model/Review.model.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";
import { orderModel } from './../../../../DB/model/Order.model.js';

export const getReview=asyncHendeler(
    async(req,res,next)=>{
     
        const check=await reviewModel.find({is_deleted:false})
        if(!check){
            return next(new Error("in-valid data",{cause:400}))
        }
      
        return res.status(201).json({message:"done",check})
    }
    
    )

export const createReview=asyncHendeler(
async(req,res,next)=>{
    const {product}=req.params
    const checkOrder=await orderModel.findOne({status:"delivered",user:req.user.id,"products.product":product})
    if(!checkOrder){
        return next(new Error("in-valid data",{cause:400}))
    }
    if(await reviewModel.findOne({product,is_deleted:false})){
        return next (new Error("already review  before ",{cause:400}))
    }
    req.body.product=product
    req.body.user=req.user.id;
    const create=await reviewModel.create(req.body)
    return res.status(201).json({message:"done",create})
}



)

export const updateReview=asyncHendeler(
    async(req,res,next)=>{
        const {review}=req.params
        const checkReview=await reviewModel.findOneAndUpdate({_id:review},req.body,{new:true})
        if(!checkReview){
            return next (new Error("error",{cause:400}))
        }
        return res.status(200).json({message:"done",checkReview})
    }
    )
export const deleteReview=asyncHendeler(
        async(req,res,next)=>{
            const {review}=req.params
            const checkReview=await reviewModel.findOneAndUpdate({_id:review},{ is_deleted:true},{new:true})
            if(!checkReview){
                return next (new Error("error",{cause:400}))
            }
            return res.status(200).json({message:"done",checkReview})
        }
        )