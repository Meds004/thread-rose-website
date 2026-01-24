import "multer"

declare global {
  interface CloudinaryFile extends Express.Multer.File {
    path: string      // Cloudinary URL
    filename: string  // publicId
  }
}