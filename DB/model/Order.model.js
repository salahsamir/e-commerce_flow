

import mongoose,{ Schema,Types,model } from "mongoose";
const order_schema=new Schema({
   user:{ type:Types.ObjectId,ref:'User',required:true},
   updatedBy:{ type:Types.ObjectId,ref:'User'},
 
   note:{type:String},
   products:[
    {  name:{type:String},
        product:{ type:Types.ObjectId, ref:'product',required:true},
        quantity:{type:Number,default:1,required:true},
        unitprice:{type:Number,default:1},
        finalprice:{type:Number,default:1}
} ],
total:{type:Number,default:1},
subtotal:{type:Number,default:1},
coupon:{type:Types.ObjectId,ref:'coupon'},
address:String,
reason:String,
phone:[String],
status:{type:String,default:"placed",enum:['placed',"wait for payment",'rejected','onWay','delivered','cancled']},
payment:{type:String,default:"card",enum:['cash','card']},

isDeleted:{type:Boolean,default:'false'}

},{

    timestamps:true
})

export const orderModel=mongoose.models.order||model('order',order_schema)