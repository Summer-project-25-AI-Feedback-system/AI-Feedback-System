import express from 'express';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Apufunktio, joka palauttaa absoluuttisen polun prompt.txt-tiedostoon
function getPromptPath() {
  // Tallennetaan prompt.txt aina server-kansioon projektin juuressa
  return path.resolve(__dirname, '../prompt.txt');
}

// Get prompt
router.get('/', async (req, res) => {
  try {
    const promptPath = getPromptPath();
    const prompt = await fs.readFile(promptPath, 'utf-8');
    res.send(prompt);
  } catch (error) {
    console.error('Error reading prompt:', error);
    res.status(500).send('Error reading prompt');
  }
});

// Save prompt
router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body;
    const promptPath = getPromptPath();
    console.log("Saatiin prompt:", prompt);
    await fs.writeFile(promptPath, prompt, 'utf-8');
    console.log("Kirjoitus onnistui!");
    res.json({ success: true });
  } catch (error) {
    console.error('Error saving prompt:', error);
    res.status(500).json({ success: false, error: 'Error saving prompt' });
  }
});

export default router;
