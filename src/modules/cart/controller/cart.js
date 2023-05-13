import CartModel from "../../../../DB/model/Card.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import { asyncHendeler } from "../../../utils/errorHandling.js";



export const Createcart=asyncHendeler(
    async(req,res,next)=>{
       
        const {product,quantity}=req.body
        const find_product=await productModel.findById(product)
        if(!find_product){
            return next(new Error("this product not found",{cause:400}))
        }
        if(find_product.stock<quantity||find_product.isDeleted){
            await productModel.findByIdAndUpdate(product,{$addToSet:{wishList:req.user.id}})
            return next(new Error("quantity not provide",{cause:400}))
        }
        const findCart=await CartModel.findOne({user:req.user.id})
        
        if(!findCart){
            const create_cart=await CartModel.create({
                
                user:req.user._id,
                products:[
                   { product,
                    quantity}
                ]
            })
         
            return res.status(201).json(create_cart)
        }
    
        let match=false
    for (let i = 0; i < findCart.products.length; i++) {
       if(findCart.products[i].product.toString()==product){
        findCart.products[i].quantity=quantity;
        match=true
        break
       } 
    }
    if(!match){
        findCart.products.push({product,quantity})
   }
       await findCart.save()
       return res.status(200).json({message:"done",findCart})
    }
)

export const Clear=asyncHendeler(
    async(req,res,next)=>{
        const clear=await CartModel.findOneAndUpdate({user:req.user.id},{products:[]},{new:true})
        if(!clear){
            return next (new Error("Error",{cause:400}))
        }
     return res.status(200).json({message:"done",clear})
    }
)


export const  Remove=asyncHendeler(
    async(req,res,next)=>{
        const{id}=req.params;
        const remove=await CartModel.findOneAndUpdate({user:req.user.id},{
            $pull:{
                products:{
                    product:{
                        $in:id
                    }
                }
            }
        },{new:true})
        if(!remove){
            return next(new Error("this item not found",{cause:400}))
        }
     return res.status(200).json({message:"done",remove})


    }
)