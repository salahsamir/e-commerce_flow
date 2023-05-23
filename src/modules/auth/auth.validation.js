
import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const signup=joi.object({
    name:joi.string().required().min(2).max(40),
    email:generalFields.email,
    password:generalFields.password,
    rePassword:generalFields.cPassword.valid(joi.ref('password')),
    file:generalFields.file,
    role:joi.string(),
    phone:joi.number().min(11),
    DOB:joi.date()

}).required()

export const signin=joi.object({

    email:generalFields.email,
    password:generalFields.password,
  

}).required()
export const forget=joi.object({

    email:generalFields.email,

}).required()
export const change=joi.object({

    code:joi.number().min(1000).max(9999),
    password:generalFields.password,
    token:joi.string().required()

}).required()
