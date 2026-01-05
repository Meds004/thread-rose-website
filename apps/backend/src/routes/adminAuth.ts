import { Router } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"

const router = Router()

// ---------------------
// POST /api/admin/login
// ---------------------
router.post("/login", async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" })
  }

  const admin = await prisma.adminUser.findUnique({
    where: { username }
  })

  if (!admin) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  const isValid = await bcrypt.compare(password, admin.passwordHash)

  if (!isValid) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  // Credentials are valid: Create session.
  req.session.admin = {
    id: admin.id,
    username: admin.username
  }

  res.json({ message: "Logged in" })
})


// ---------------------
// GET /api/admin/me
// ---------------------
router.get("/me", async (req, res) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  res.json(req.session.admin)
})

export default router