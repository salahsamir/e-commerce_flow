

import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const productSchema = new Schema({

    name: {
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
        required:true
    },
    updatedBy:{
        type:Types.ObjectId,
        ref:"User"
    },
   main_image:{
        type:Object,
        required:true
    },
    images:[{
        type:Object,
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
    discount:{
        type:Number,
        default:1
    },
    totalprice:{
        type:Number,
        required:true,
        default:1
    },
    stock:{
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
    colors:[{type:String }],
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