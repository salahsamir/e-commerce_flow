
import { GraphQLBoolean,  GraphQLID,  GraphQLInt,  GraphQLList,  GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import categoryModel from "../../../../DB/model/Category.model.js";
import { object_type } from "./types.js";
import { validation_grapg } from "../../../middleware/validation.js";
import { specific } from "./validation.js";

export const schema=new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"Category",
        description:"graphql for category",
        fields:{
           getCategories:{
            type:new GraphQLList(object_type),
            resolve:async(parent,args)=>{
                const findCategories=await categoryModel.find({isDeleted:false})
               if(!findCategories.length){
                return {message:"fail"}
             
                  }
             return findCategories
            }
           },
           getSpecific:{
            type:object_type,
            args:{
                id:{type:GraphQLID}
            },
            resolve:async(parent,args)=>{
                await validation_grapg(specific,{id:args.id})
                const findCategories=await categoryModel.findOne({_id:args.id,isDeleted:false})
                 if(!findCategories){
                     return next(new Error("Category  not exist",{cause:400}))
                 }
               return findCategories
            }

           }

        }
    }),
    mutation:new GraphQLObjectType({
        name:"category",
        fields:{
            deleteCategory:{
                type:object_type,
                args:{id:{type:GraphQLID}},
                resolve:async(perant,args)=>{
                    await validation_grapg(specific,{id:args.id})
                    const findOne=await categoryModel.findOneAndUpdate({_id:args.id,isDeleted:false},{isDeleted:true},{new:true})
                    if(!findOne){
                        return next(new Error("Category not exist",{cause:400}))
                    }
                  return findOne
    
                }
    
               }
        }
    })
})