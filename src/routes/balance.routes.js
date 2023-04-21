import {Router} from "express"
import { authValidation } from "../middlewares/auth.middleware.js"
import {getBalance, postNewBalance} from "../controllers/balance.controller.js"
import { validateSchema } from "../middlewares/validateSchema.middleware.js"
import { balanceSchema } from "../schemas/balance.schema.js"

const balanceRouter = Router()

balanceRouter.use(authValidation)

balanceRouter.post("/nova-transacao/:tipo", validateSchema(balanceSchema),postNewBalance)
balanceRouter.get("/home", getBalance)

export default balanceRouter