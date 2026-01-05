import { Request, Response, NextFunction } from "express"

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session.admin) {
    return res.status(404).json({ message: "Not found" })
  }
  
  next()
}