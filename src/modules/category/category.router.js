import { Router } from "express";
import * as categoryController from './controller/category.js'
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { validation } from "../../middleware/validation.js";
import { Create, Params, Update } from "./category.validation.js";
// import { graphqlHTTP } from "express-graphql";
// import { schema } from "./Graph/fields.js";
import subcatecoryRouter from '../subcategory/subcategory.router.js'
import auth, { Roles } from "../../middleware/auth.js";

const router = Router()
// router.use('/Graph',graphqlHTTP({
//     schema,
//     graphiql:true
// }))
router.use('/:category/subcategory',subcatecoryRouter)
router.get("/categories",categoryController.getAllCategory)
router.get("/:id",auth(Object.values(Roles)),validation(Params),categoryController.getSpecificCategory)
router.post("/",auth(Roles.Admin),fileUpload(fileValidation.image).single("image"),validation(Create),categoryController.CreateCategory)
router.put("/:id",auth(Roles.Admin),fileUpload(fileValidation.image).single("image"),validation(Update),categoryController.UpdateCategory)
router.delete("/:id",auth(Roles.Admin),validation(Params),categoryController.DeleteCategory)



export default router