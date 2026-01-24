import { Request, Response } from "express"
import { prisma } from "../lib/prisma"
import { v2 as cloudinary } from "cloudinary"

// --- Create Product ---
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { title, subtitle, description, price, discount, quantity, altTexts } = req.body
    const files = req.files as CloudinaryFile[]

    const altTextsArray = Array.isArray(altTexts) ? altTexts : [altTexts]

    if(!files || files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" })
    }

    const product = await prisma.product.create({
      data: {
        title,
        subtitle,
        description,
        price: parseInt(price),
        discount: discount ? parseInt(discount) : null,
        quantity: parseInt(quantity),
        images: {
          create: files.map((file, index) => ({
            url: file.path,
            publicId: file.filename,
            altText: altTextsArray[index] || title,     // uses product title if no provided alt text
            isPrimary: index === 0 // first picture is always primary (ensure correct order on frontend)
          }))
        }
      },
      include: { images: true }
    })

    res.status(201).json(product)
  } catch (error) {
    console.error("Create Product Error:", error)
    res.status(500).json({ message: "Internal server error"} )
  }
}

// --- GET ALL PRODUCTS ---
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: { images: true },
      orderBy: { id: "desc" }
    })

    res.json(products)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch products"} )
  }
}

// --- GET SINGLE PRODUCT ---
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: Number(req.params.id) },
      include: { images: true }
    })

    if (!product) {
       return res.status(404).json({ message: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" })
  }
}

// --- UPDATE PRODUCT ---
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { title, subtitle, description, price, discount, quantity, isActive } = req.body
    const files = req.files as CloudinaryFile[]

    // update text fields
    const updatedProduct = await prisma.product.update({
      where: { id: Number(id)},
      data: {
        title,
        subtitle,
        description,
        price: price ? parseInt(price) : undefined,
        discount: discount ? parseInt(discount) : undefined,
        quantity: quantity ? parseInt(quantity) : undefined,
        isActive: isActive !== undefined ? isActive === 'true' : undefined
      }
    })

    // if new images uploaded, add them to the Product
    if (files && files.length > 0) {
      await prisma.productImage.createMany({
        data: files.map(file => ({
          productId: Number(id),
          url: file.path,
          publicId: file.filename,
          altText: title || updatedProduct.title,
          isPrimary: false
        }))
      })
    }

    // return the fully updated product with its images
    const finalProduct = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: { images: true }
    })

    res.json(finalProduct)
  } catch (error) {
    console.error("Update Error:", error)
    res.status(500).json({ message: "Failed to update product." })
  }
}

// --- DELETE PRODUCT ---
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    // find product to get image IDs
    const product = await prisma.product.findUnique({
      where: { id: Number(id)},
      include: { images: true }
    })

    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // delete product from DB (cascade handles ProductImage deletion)
    await prisma.product.delete({
      where: { id: Number(id)}
    })

    // clean up Cloudinary
    const publicIds = product.images.map(img => img.publicId)

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds)
    }

    res.status(204).send()
  } catch (error) {
    console.error("Delete Error:", error)
    res.status(500).json({ message: "Deletion failed" })
  }
}