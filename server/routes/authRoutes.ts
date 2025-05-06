import { Router } from "express";

const router = Router();

// Example login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Dummy authentication logic
  if (email === "test@example.com" && password === "password123") {
    res.status(200).json({ token: "fake-jwt-token", user: { email } });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// Example register route
router.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Here you'd insert logic to save user to DB
  res.status(201).json({ message: "User registered successfully", email });
});

export default router;
