export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) return res.status(400).json({ error: "No image provided" });

  try {
    const { OpenAI } = require("openai");
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "user", content: `请根据这张图片生成提示词: ${imageBase64}` }
      ]
    });

    res.status(200).json({ result: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
