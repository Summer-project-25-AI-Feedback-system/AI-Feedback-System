import { Router, Request, Response } from "express";
import { upsertUser } from "../services/supabase/userService";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { id, username, email, github_url } = req.body;

  try {
    const user = await upsertUser(id, username, email, github_url); // korjattu järjestys
    res.status(200).json({ message: "User upserted", user });
  } catch (err) {
    console.error("Virhe käyttäjän tallennuksessa:", err);
    res
      .status(500)
      .json({
        error:
          err instanceof Error
            ? err.message
            : "Käyttäjän tallennus epäonnistui",
      });
  }
});

export default router;
