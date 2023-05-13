


import mongoose, { Schema, Types, model } from "mongoose";
import slugify from "slugify";


const CartSchema = new Schema({

    user:{ type:Types.ObjectId,
        ref:'User',
        required:true,unique:true},
        products:[
         {
             product:{ type:Types.ObjectId, ref:'product',required:true,unique:true},
             quantity:{type:Number,default:1,required:true}
     }
     
        ],
    isDeleted:{
        type:Boolean,
        default:false
    },
 
}, {
    timestamps: true
})


const CartModel = mongoose.models.Cart|| model('Cart', CartSchema)
export default CartModel