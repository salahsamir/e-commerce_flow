import { Router } from "express";
import * as productController from './controller/product.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import auth, { Roles } from "../../middleware/auth.js";

const router = Router()

router.get("/",productController.getAllproduct)
router.get("/:id",auth(Object.values(Roles)),productController.getSpecificproduct)
router.post("/",auth(Roles.Admin),fileUpload(fileValidation.image).fields([{name:"image"},{name:"images"}]),productController.Createproduct)
router.put("/:id",auth(Roles.Admin),fileUpload(fileValidation.image).single("image"),productController.Updateproduct)
router.delete("/:id",auth(Roles.Admin),productController.Deleteproduct)
router.patch("/:product",auth(Object.values(Roles)),productController.wishList)




export default router