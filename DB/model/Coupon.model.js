
import mongoose, { Schema, Types, model } from "mongoose";



const CouponSchema = new Schema({

    name: {
        type: String,
        required: [true, 'Name is required'],
       
        lowercase:true

    },
    amount:{
        type:Number,
        required:true,
        defulat:1
    },
    createdBy:{
        type:Types.ObjectId,
        ref:"User",
        required:true
    
    },
    usedBy:[{ type:Types.ObjectId,
        ref:"User"}],
    updatedBy:{
        type:Types.ObjectId,
        ref:"User"
    },
    expireDate:{
     type:Date,
     required:true
    },
    image:{
        type:Object
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
 
}, {
    timestamps: true
})


const CouponModel = mongoose.models.Coupon|| model('Coupon', CouponSchema)
export default CouponModel