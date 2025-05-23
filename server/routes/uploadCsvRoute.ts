import { Router, Request, Response } from "express";
import { createClient } from "@supabase/supabase-js";
import { Parser } from "json2csv";
import dotenv from "dotenv";


dotenv.config({ path: "../.env" }); 

const router = Router();


if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  throw new Error("Supabase URL or Key is missing in environment variables.");
}

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);
router.post("/csv-reports", async (req: Request, res: Response): Promise<void> => {
  console.log("🔄 /csv-reports POST received");
  console.log("Body:", req.body); 

  try {
    const { rows } = req.body;

    if (!rows || !Array.isArray(rows.submissions)) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    
    const parser = new Parser();
    const csv = parser.parse(rows.submissions);

    
    const fileName = `report_${Date.now()}.csv`;
    const csvBuffer = new Uint8Array(Buffer.from(csv)); 

    const { error } = await supabase.storage
      .from("csv-reports")
      .upload(fileName, csvBuffer, {
        contentType: "text/csv",
        upsert: false,
      });

    if (error) throw error;

    console.log(`✅ CSV uploaded as ${fileName}`);
    res.status(200).json({ message: "CSV uploaded successfully", fileName });
  } catch (err: any) {
    console.error("❌ Error uploading CSV:", err.message);
    res.status(500).json({ error: "CSV upload failed", details: err.message });
  }
});

export default router;


