// /api/generate.js

export default async function handler(req, res) {
  // 1. Ambil data yang dikirim dari frontend
  const { prompt, parts } = req.body;
  const apiKey = process.env.GEMINI_API_KEY; // Ambil kunci dari brankas Vercel

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts: parts }],
    generationConfig: { temperature: 0.7, topP: 1.0, maxOutputTokens: 2048 }
  };

  try {
    // 2. Kirim request ke Google AI dari server
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Gagal menghubungi Google AI');
    }

    const result = await response.json();
    
    // 3. Kirim hasilnya kembali ke frontend
    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}