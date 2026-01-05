import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import session from "express-session"
import pg from "pg"
import connectPgSimple = require("connect-pg-simple")
import { prisma } from "./lib/prisma"
import adminAuthRoutes from "./routes/adminAuth"
import adminSecureRoutes from "./routes/adminSecure"
import { requireAdmin } from "./middleware/requireAdmin"


dotenv.config();

// extend types for express-session
declare module "express-session" {
  interface SessionData {
    admin?: {
      id: number;
      username: string;
    };
  }
}


// ---------------
// Database Setup
// ---------------
const connectionString = `${process.env.DATABASE_URL}`

// pg pool for sessions (separate from Prisma, intentionally)
const pgPool = new pg.Pool({
  connectionString
})


// ---------------
// App Setup
// ---------------
const app = express()

app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true
}))

app.use(express.json());


// ---------------
// Session Setup
// ---------------
const PgSession = connectPgSimple(session)

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

// Public admin routes
app.use("/api/admin", adminAuthRoutes)

// Protected admin routes
app.use("/api/admin/secure", requireAdmin, adminSecureRoutes)


// ---------------
// Health Checks
// ---------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/health/db", async (_req, res) => {
  try {
    const result = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() AS now;`;
    res.json({ dbTime: result[0].now });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Database connection failed" });
  }
});


// ---------------
// Server Start
// ---------------
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});