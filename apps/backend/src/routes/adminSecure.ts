import { Router } from "express"

const router = Router()

router.get ("/dashboard", (_req, res) => {
  res.json({ message: "Welcome, admin" })
})

export default router