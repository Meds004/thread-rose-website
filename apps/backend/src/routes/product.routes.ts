import { Router } from "express"
import { upload } from "../middleware/upload"
import { requireAdmin } from "../middleware/requireAdmin"
import * as ProductController from "../controllers/product.controller"

const router = Router()

// PUBLIC
router.get("/", ProductController.getAllProducts)
router.get("/:id", ProductController.getProductById)

// PROTECTED
router.post(
  "/",
  requireAdmin,
  upload.array("images", 5),
  ProductController.createProduct
)

router.patch(
  "/:id",
  requireAdmin,
  upload.array("images", 5),
  ProductController.updateProduct
)

router.delete(
  "/:id",
  requireAdmin,
  ProductController.deleteProduct
)

export default router