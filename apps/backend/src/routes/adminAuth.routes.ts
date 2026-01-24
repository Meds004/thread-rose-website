import { Router } from "express"
import * as AdminController from "../controllers/admin.controller"

const router = Router()

router.post("/login", AdminController.login)
router.post("/logout", AdminController.logout)
router.get("/me", AdminController.getMe)

export default router