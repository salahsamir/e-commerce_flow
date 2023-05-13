


import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const reviewSchema = new Schema({
    
    user:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    },
    order:{
        type:Types.ObjectId,
        ref:"order"
    },
    product:{
        type:Types.ObjectId,
        ref:"product"
    },
    comment:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        required:true
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
 
}, {
    timestamps: true
})


const reviewModel = mongoose.models.review|| model('review', reviewSchema)
export default reviewModel