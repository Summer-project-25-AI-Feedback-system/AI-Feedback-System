import express from "express";
import session from "express-session";
import passport from "./utils/passport";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import githubRoutes from "./routes/githubRoutes";
import submitRoute from"./routes/submitRoute";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
    secret: process.env.SESSION_SECRET || "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true only in production (HTTPS)
      sameSite: "lax", // or "none" if secure: true for cross-origin
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// test message
app.get("/api/message", (req, res) => {
  res.json({ message: "Test message from backend!" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/github", githubRoutes);
app.use("/api", submitRoute);
// Error handling
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
