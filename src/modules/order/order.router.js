import { Router } from "express";
import * as orderController from './controller/order.js'

import auth, { Roles } from "../../middleware/auth.js";

const router = Router()

router.post("/",auth(Object.values(Roles)),orderController.Createorder)
router.put("/:id",auth(Object.values(Roles)),orderController.CansleOrder)
router.put("/:id/deliver",auth(Roles.Admin),orderController.deliveredOrder)





export default router