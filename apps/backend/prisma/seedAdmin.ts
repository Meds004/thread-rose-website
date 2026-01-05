import bcrypt from "bcrypt"
import dotenv from "dotenv"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client"

dotenv.config()

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  const username = process.env.ADMIN_USERNAME
  const password = process.env.ADMIN_PASSWORD

  if (!username || !password) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set");
  }

  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.adminUser.create({
    data: {
      username,
      passwordHash
    }
  })

  console.log("Admin user created")
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())