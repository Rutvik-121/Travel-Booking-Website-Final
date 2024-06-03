import { Router } from "express"
import { book } from "../controllers/booking.controlers.js"

import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/book").post(
    verifyJWT,
    book
)

export default router