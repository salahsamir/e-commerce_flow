import { Router } from "express";
import * as couponController from './controller/coupon.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { Create, Params, Update } from "./coupon.validation.js";

const router = Router()

router.get("/",couponController.getAllCoupon)
router.get("/:id",validation(Params),couponController.getSpecificCoupon)
router.post("/",fileUpload(fileValidation.image).single("image"),validation(Create),couponController.CreateCoupon)
router.put("/:id",fileUpload(fileValidation.image).single("image"),validation(Update),couponController.UpdateCoupon)
router.delete("/:id",validation(Params),couponController.DeleteCoupon)



export default router