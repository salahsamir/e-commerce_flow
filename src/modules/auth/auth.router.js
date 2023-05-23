import { Router } from "express";
import * as authController from './controller/registration.js'
import { validation } from "../../middleware/validation.js";
import { change, forget, signin, signup } from "./auth.validation.js";
const router = Router()

router.post('/signup',validation(signup),authController.signup)

// router.get('/confirem/:token',authController.confirmEmail)

router.post('/signin',validation(signin),authController.signin)
// router.post('/forgetpassword',validation(forget),authController.forgetpassword)
// router.post('/change/:token',validation(change),authController.changepassword)




export default router