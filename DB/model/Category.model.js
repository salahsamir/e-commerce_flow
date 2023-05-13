

import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const categorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true,
        unique:[true,"name must be unique"]

    },
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
    image:{
        type:Object,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
 
}, {
    toJSON:{virtuals:true},
    toObject:{virtuals:true},
    timestamps: true
})
categorySchema.pre('save',function(){
    this.slug=slugify(this.name)
})
categorySchema.virtual("SubCategory",{
    localField:'_id',
    foreignField:"category",
    ref:"SubCategory"
})

const categoryModel = mongoose.models.Category|| model('Category', categorySchema)
export default categoryModel