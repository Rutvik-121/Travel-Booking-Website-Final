import { Router } from "express"
import { registerUser, loginUser, logoutUser, refreshAccessToken, verifyLoginCredentials, verifyRegisterCredentials, changeCurrentPassword, verifyCurrentpassword } from "../controllers/user.controller.js"

import verifyJWT from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(

    registerUser
)

router.route("/login").post(loginUser)
router.route("/verifyLogin").post(verifyLoginCredentials)
router.route("/logout").get(verifyJWT, logoutUser)
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)
router.route("/verifyCurrentPassword").post(verifyJWT, verifyCurrentpassword)
router.route("/refreshAccessToken").post(refreshAccessToken)
router.route("/verifyRegister").post(verifyRegisterCredentials)

export default router