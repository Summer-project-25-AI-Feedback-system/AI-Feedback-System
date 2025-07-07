import express from "express";
import session from "express-session";
import passport from "./utils/passport";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import githubRoutes from "./routes/githubRoutes";
import uploadCsvRoute from "./routes/uploadCsvRoute";
import aiRoutes from "./routes/aiRoutes";
import promptRoutes from "./routes/promptRouter";
import supabaseRoutes from "./routes/supabaseRoutes";
import "./services/github/githubService";

const nodeEnv = process.env.NODE_ENV || "development";
dotenv.config({ path: nodeEnv === "production" ? ".env.production" : ".env" });

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const isProd = nodeEnv === "production";

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up session
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProd, // Set to true only in production (HTTPS)
      sameSite: isProd ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
    name: "afs_session", // Custom session cookie name
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Health check
app.get("/api/message", (req, res) => {
  res.json({ message: "Test message from backend!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api/evaluation", aiRoutes);
app.use("/api", uploadCsvRoute);
app.use("/api/prompt", promptRoutes);
app.use("/api/supabase", supabaseRoutes);

// Error handling
app.use(
  (
    err: any,
    _: express.Request,
    res: express.Response,
    __: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
