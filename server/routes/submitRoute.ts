import { Router, Request, Response } from "express";
import { upsertUser } from "../services/UserService";

const router = Router();

router.post("/submit", async (req: Request, res: Response) => {
  const { id, name, email, github_url } = req.body;

  try {
    const user = await upsertUser(github_url, id, email, name); // Lisää githubUrl funktioon
    res.status(200).json({ message: "User upserted", user });
  } catch (err) {
    console.error("Virhe käyttäjän tallennuksessa:", err);
    res.status(500).json({ error: "Käyttäjän tallennus epäonnistui" });
  }
}); 

export default router;

