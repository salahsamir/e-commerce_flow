import { asyncHendeler } from "../../../utils/errorHandling.js";
import CouponModel from './../../../../DB/model/Coupon.model.js';
import productModel from './../../../../DB/model/Product.model.js';
import CartModel from './../../../../DB/model/Card.model.js';
import { orderModel } from './../../../../DB/model/Order.model.js';



export let Createorder=asyncHendeler(
    async(req,res,next)=>{
     let{couponName,address,phone,note,payment}=req.body;
     const Cart=await CartModel.findOne({user:req.user.id})
     if(!Cart || ! Cart?.products.length){
      return next(new Error("empty cart ",{cause:400}))

     }
    
     req.body.products=Cart.products
      if(couponName){
        let checkCoupon=await CouponModel.findOne({name:couponName,usedBy:{$nin:req.user.id}})
      if(!checkCoupon){
        return next(new Error(" please check your coupon ",{cause:400}))
      }
      req.body.coupon=checkCoupon
      }
       
      let ids=[]
     let  ArrayProduct=[]
     let subtotal=0
      for (let element of req.body.products) {
        let checkProduct=await productModel.findOne({_id:element.product,isDeleted:false,stock:{$gte:element.quantity}})
        ids.push(element.product)
      if(!checkProduct){
        return next(new Error(" please check your product ",{cause:400}))

      }
      element=element.toObject()
      element.name=checkProduct.name
      element.unitprice=checkProduct.price;
      element.finalprice=Number.parseFloat(checkProduct.totalprice).toFixed(2)
      subtotal+=Number.parseFloat(element.finalprice).toFixed(0)
      ArrayProduct.push(element)
      }

      let Order={
        user:req.user.id,
        coupon:req.body.coupon?._id,
        products:req.body.products,
        subtotal,
         total:Number.parseFloat(subtotal-( subtotal*((req.body.coupon?.amount||0))/100)).toFixed(2),
        address,
        phone,
        payment,
        note,
        status:payment?"wait for payment":"placed"
      }

      ///decrease stock products
      for (const element of req.body.products) {
        await productModel.findByIdAndUpdate(element.product,{$inc:{stock:-parseInt(element.quantity)}})
      }
      if(req.body.coupon){
        await CouponModel.findByIdAndUpdate(req.body.coupon._id,{$addToSet:{usedBy:req.user.id}})
      }
      // console.log(ids);
      await CartModel.updateOne({user:req.user.id},{
        products:[]
        // $pull:{
        //   products:{
        //     product:{$in:ids}
        //   }
        // }
      })
      const create=await orderModel.create(Order)
      return res.status(201).json({message:"done",create})


    }
)


export const CansleOrder=asyncHendeler(
  async(req,res,next)=>{
    const{id}=req.params;
    const {reason}=req.body

    const order=await orderModel.findOne({_id:id,user:req.user.id})
    if(!order){
      return next(new Error(("order not exist",{cause:400})))
    }
    if(!order.status=="placed"&&order.payment=="cash"||!order.status=="wait for payment"&&order.payment=="card"){
      return next(new Error((" fail to canseled this order",{cause:400})))
    }
    const cansle=await orderModel.findByIdAndUpdate(id,{status:"cancled",reason})
    if(!cansle){
      return next(new Error(("Error",{cause:400})))
    }
    for (const element of cansle.products) {
      await productModel.findByIdAndUpdate(element.product,{$inc:{stock:parseInt(element.quantity)}})
    }
    if(cansle.coupon){
      await CouponModel.findByIdAndUpdate(cansle.coupon,{$pull:{usedBy:req.user.id}})
    }
    return res.status(200).json({message:"done"})
  }
)

export const deliveredOrder=asyncHendeler(
  async(req,res,next)=>{
    const{id}=req.params;
    const order=await orderModel.findOneAndUpdate({_id:id,status:{$nin:['rejected','onWay','delivered','cancled']}},{status:'delivered',updatedBy:req.user.id},{new :true})
    if(!order){
      return next(new Error("ordre not exist ",{cause:400}))
    }
    return res.status(200).json({message:"done",order})
  }
)