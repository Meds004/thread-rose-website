import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { prisma } from "../lib/prisma"

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" })
  }

  try {
    const admin = await prisma.adminUser.findUnique({ where: { username } })

    if (!admin || !(await bcrypt.compare(password, admin.passwordHash))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Valid credentials - create session
    req.session.admin = { id: admin.id, username: admin.username }

    res.json({ id: admin.id, username: admin.username })
  } catch (error) {
    res.status(500).json({ message: "Internal server error"} )
  }
}

export const logout = (_req: Request, res: Response) => {
  res.clearCookie("admin.sid", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  })

  res.status(200).json({ success: true, message: "Loggout out" })

}

export const getMe = async (req: Request, res: Response) => {
  if (!req.session.admin) {
    return res.status(401).json({ message: "Not authenticated" })
  }

  // Extra security measure - verify against DB in case account is deleted.
  const admin = await prisma.adminUser.findUnique({
    where: { id: req.session.admin.id}
  })

  if (!admin) {
    return res.status(401).json({ message: "Account no longer exists." })
  }

  res.json(req.session.admin)
}

export const getDashboard = (_req: Request, res: Response) => {
  res.json({ message: "Welcome, admin"})
}