
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'
  
export const Params=joi.object({
   

    id:generalFields.id.required()
}).required()


export const Create=joi.object({
    name:joi.string().min(2).max(100).required(),
    file:generalFields.file,
    amount:joi.number().positive().min(0).max(100),
    expireDate:joi.date()
}).required()
export const Update=joi.object({
    name:joi.string().min(2).max(100),
    file:generalFields.file,
    id:generalFields.id.required(),
    amount:joi.number().positive().min(0).max(100),
    expireDate:joi.date()
}).required()