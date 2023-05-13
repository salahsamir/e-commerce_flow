import { Router } from "express";
import * as subcategoryController from './controller/Subcategory.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { Create, Params, Update } from "./subcategory.validation.js";

const router = Router({mergeParams:true})

router.get("/",subcategoryController.getAllSubCategory)
router.get("/:id",validation(Params),subcategoryController.getSpecificSubCategory)
//i use merge params to get category id
router.post("/",fileUpload(fileValidation.image).single("image"),validation(Create),subcategoryController.CreateSubCategory)
router.put("/:id",fileUpload(fileValidation.image).single("image"),validation(Update),subcategoryController.UpdateSubCategory)
router.delete("/:id",validation(Params),subcategoryController.DeleteSubCategory)




export default router