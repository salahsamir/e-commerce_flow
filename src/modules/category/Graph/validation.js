
import joi from 'joi'
import { generalFields } from '../../../middleware/validation.js'

export const specific=joi.object({
    id:generalFields.id
}).required()