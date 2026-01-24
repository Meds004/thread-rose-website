import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import pg from "pg"
import connectPgSimple = require("connect-pg-simple")

// Routes
import adminAuthRoutes from "./routes/adminAuth.routes"
import adminSecureRoutes from "./routes/adminSecure.routes"
import productRoutes from "./routes/product.routes"
import { requireAdmin } from "./middleware/requireAdmin"

dotenv.config()

if (!process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET is missing from .env file")
}

const app = express()

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}))

app.use(express.json());

// Session setup
const PgSession = connectPgSimple(session)
const pgPool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
})

app.use(
  session({
    store: new PgSession({
      pool: pgPool,
      tableName: "session"
    }),
    name: "admin.sid",
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8    // 8 hours
    }
  })
)

// Routes
app.use("/api/admin", adminAuthRoutes)
app.use("/api/admin/secure", requireAdmin, adminSecureRoutes)
app.use("/api/products", productRoutes)

app.get("/health", (_req, res) => res.json({ status: "ok" }))


// Server Start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});