import { Router } from "express";
import * as reviewController from './controller/review.js'

import auth, { Roles } from "../../middleware/auth.js";

const router = Router()
router.get("/",auth(Object.values(Roles)),reviewController.getReview)

router.post("/:product",auth(Object.values(Roles)),reviewController.createReview)
router.put("/:review",auth(Object.values(Roles)),reviewController.updateReview)
router.patch("/:review",auth(Object.values(Roles)),reviewController.deleteReview)





export default router