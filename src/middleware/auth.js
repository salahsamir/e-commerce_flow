import jwt from "jsonwebtoken";
import userModel from "../../DB/model/User.model.js";
import { asyncHendeler } from "../utils/errorHandling.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";

export const Roles=
    {
        Admin:"Admin",
        User:"User"
    }

export const auth =(authRole)=>{
    return asyncHendeler(
        async (req, res, next) => {
                const { authorization } = req.headers;
                if (!authorization?.startsWith(process.env.BEARER_KEY)) {
                   
                    return next(new Error("In-valid bearer key",{cause:400}))
                }
                const token = authorization.split(process.env.BEARER_KEY)[1]
              
                if (!token) {
                    return next(new Error("In-valid token",{cause:400}))
                   
                }
                const decoded = verifyToken({token})
                // console.log(decoded);
                if (!decoded?.id) {
                    return next(new Error("In-valid token payload",{cause:400}))
                }
                const authUser = await userModel.findById(decoded.id).select('userName email role')
                if (!authUser) {
                    return next(new Error( "Not register account",{cause:400}))
                }
                if(!authRole.includes(authUser.role)){
                    return next(new Error( "Not authorized account",{cause:400}))
                }
                req.user = authUser;
                return next()
            } 
        
      )
}

export default auth