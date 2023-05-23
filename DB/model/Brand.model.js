


import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const brandSchema = new Schema({

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
        type:String,
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
 
}, {
    timestamps: true
})
brandSchema.pre('save',function(){
    this.slug=slugify(this.name)
  
   
})

const brandModel = mongoose.models.brand|| model('brand', brandSchema)
export default brandModel