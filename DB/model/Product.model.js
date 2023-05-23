

import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const productSchema = new Schema({

    title: {
        type: String,
        required: [true, 'Name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true,
       

    },
    description: {
        type: String},
    slug:{
        type: String,
        lowercase:true,
        unique:[true,"name must be unique"]
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        // required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    imageCover:{
        type:String,
        required:true
    },
    images:[{
        type:String,
        required:true
    }],
    isDeleted:{
        type:Boolean,
        default:false
    },
    category:{
        type:Types.ObjectId,
        ref:"Category",
        required:true
    },
    subcategory:{
        type:Types.ObjectId,
        ref:"SubCategory",
        required:true
    },
    brand:{
        type:Types.ObjectId,
        ref:"brand",
        required:true
    },
    price:{
        type:Number,
        required:true,
        default:1
    },
    ratingsQuantity:{
        type:Number,
        default:1
    },
    ratingsAverage:{
        type:Number,
        default:1
    },
    sold:{
        type:Number,
        required:true,
        default:1
    },
    avgRate:{
        type:Number
    },
    sizes:[{type:String,
        default:"md",
        enum:["sm","md","xl","xxl"]
    }],
    availableColors:[{type:String }],
    wishList:[{ type:Types.ObjectId,
        ref:"User",}]
    
 
 
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})
productSchema.pre('save',function(){
    this.slug=slugify(this.name)
})
productSchema.virtual("reviews",{
    ref:"review",
    localField:"_id",
    foreignField:"product"
})


const productModel = mongoose.models.product|| model('product', productSchema)
export default productModel