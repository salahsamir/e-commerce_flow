
import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const SubCategorySchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        lowercase:true

    },
    slug:{
        type: String,
        lowercase:true,
      
    },
    category:{
        type:Types.ObjectId,
        ref:"Category",
        required:true
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User"
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
    timestamps: true
})
SubCategorySchema.pre('save',function(){
    this.slug=slugify(this.name)
  
   
})

const SubCategoryModel = mongoose.models.SubCategory|| model('SubCategory', SubCategorySchema)
export default SubCategoryModel