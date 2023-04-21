import {Router} from "express"
import userRouter from "./user.routes.js"
import balanceRouter from "./balance.routes.js"

const router = Router()

router.use(userRouter)
router.use(balanceRouter)

export default router