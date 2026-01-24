import multer from "multer"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import cloudinary from "../config/cloudinary"

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
    format: "webp",
    transformation: [{ width: 1200, height: 1200, crop: 'limit' }],
    public_id: (req: any, file: any) => {
      const fileName = file.originalname.split(".")[0]
      return `${Date.now()}-${fileName}`
    }
  } as any
})

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files allowed"))
    }
    cb(null, true)
  }
})