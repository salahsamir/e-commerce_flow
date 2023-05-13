import { Router } from "express";
import * as brandController from './controller/brand.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { Create, Params, Update } from "./brand.validation.js";
import auth, { Roles } from './../../middleware/auth.js';
const router = Router()
router.get("/",brandController.getAllbrand)
router.get("/:id",validation(Params),brandController.getSpecificbrand)
router.post("/",auth(Roles.Admin),fileUpload(fileValidation.image).single("image"),validation(Create),brandController.Createbrand)
router.put("/:id",auth(Roles.Admin),fileUpload(fileValidation.image).single("image"),validation(Update),brandController.Updatebrand)
router.delete("/:id",auth(Roles.Admin),validation(Params),brandController.Deletebrand)
export default router