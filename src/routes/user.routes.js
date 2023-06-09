import {Router} from "express"
import { signupSchema } from "../schemas/signup.schema.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { signinSchema } from "../schemas/signin.schema.js"
import { deleteUser } from "../controllers/user.controller.js"
import { postSingIn, postSingUp } from "../controllers/user.controller.js"


const userRouter = Router()

userRouter.post("/cadastro", validateSchema(signupSchema), postSingUp)
userRouter.delete("/sessions", deleteUser )
userRouter.post("/", validateSchema(signinSchema), postSingIn)

export default userRouter