// File: /api/generate.js
// Ini adalah fungsi backend yang akan berjalan di server Vercel.

export default async function handler(req, res) {
  // Hanya izinkan metode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // 1. Ambil 'parts' yang dikirim dari frontend.
    const { parts } = req.body;

    // Pastikan 'parts' ada dan merupakan array.
    if (!parts || !Array.isArray(parts)) {
      return res.status(400).json({ error: "Input 'parts' tidak valid." });
    }

    // 2. Ambil API Key dari Environment Variables di Vercel (brankas digital).
    // Ini adalah bagian yang paling penting untuk keamanan.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Jika API Key tidak disetel di Vercel, kirim error.
      return res.status(500).json({ error: 'GEMINI_API_KEY tidak dikonfigurasi di server.' });
    }

    // 3. Siapkan URL dan payload lengkap untuk dikirim ke Google AI.
    const googleApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{ role: "user", parts: parts }],
      generationConfig: {
        temperature: 0.7,
        topP: 1.0,
        maxOutputTokens: 2048,
      },
    };

    // 4. Kirim request ke Google AI dari server Vercel.
    const response = await fetch(googleApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
        console.error('Google API Error:', result);
        throw new Error(result.error?.message || 'Gagal menghubungi Google AI.');
    }

    // 5. Kirim hasil yang sukses kembali ke frontend.
    res.status(200).json(result);

  } catch (error) {
    console.error('Server-side error:', error);
    res.status(500).json({ error: error.message });
  }
}
