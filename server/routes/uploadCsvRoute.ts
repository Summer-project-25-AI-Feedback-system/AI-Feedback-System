
import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Parser } from "json2csv";


const router = Router();

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY! 
);

router.post("/csv-reports", async (req: Request, res: Response ): Promise <void> =>  {
  try {
    const  {rows} = req.body;
    if (!rows || !Array.isArray(rows)) {
       res.status(400).json({ error: "Invalid input data" });
       return;
    }

    const parser = new Parser();
    const csv = parser.parse(rows);

    const fileName = `report_${Date.now()}.csv`;

    const { error } = await supabase.storage
      .from("csv-reports")
      .upload(fileName, Buffer.from(csv), {
        contentType: "text/csv",
        upsert: false,
      });

    if (error) throw error;

     res.status(200).json({ message: "CSV uploaded successfully" });
  } catch (err: any) {
    console.error("Error uploading CSV:", err.message);
   res.status(500).json({ error: "CSV upload failed" });
  }
});

export default router;

