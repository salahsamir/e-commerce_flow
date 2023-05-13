import { Router } from "express";
import * as cartController from './controller/cart.js'

import auth, { Roles } from "../../middleware/auth.js";

const router = Router()

router.post("/",auth(Roles.User),cartController.Createcart)
router.put("/",auth(Roles.User),cartController.Clear)
router.patch("/:id",auth(Roles.User),cartController.Remove)






export default router