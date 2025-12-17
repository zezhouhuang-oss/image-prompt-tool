import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { imageBase64 } = req.body;
  if (!imageBase64) {
    return res.status(400).json({ error: "请上传图片" });
  }

  try {
    // 使用 GPT-3.5 生成文字描述 / 提示词
    const prompt = `
你是一个专业短剧海报设计师。
请根据以下图片描述（Base64 或简单文字），生成详细的提示词：
- 描述图片的主体内容
- 场景设定
- 整体风格
- 色调与色彩
- 构图与视角
- 光影与质感
- 细节补充
请用中文输出，每个部分分段清晰。

图片内容（Base64 或简单文字）：${imageBase64}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 600
    });

    const result = completion.choices[0].message.content;
    res.status(200).json({ result });
  } catch (error) {
    if (error.response?.status === 429) {
      res.status(429).json({ error: "API 配额超限，请稍后再试" });
    } else {
      console.error(error);
      res.status(500).json({ error: "服务器内部错误" });
    }
  }
}
