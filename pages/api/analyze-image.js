export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "只支持 POST 请求" });
  }

  const { imageBase64 } = req.body;

  if (!imageBase64) {
    return res.status(400).json({ error: "请上传图片" });
  }

  try {
    // 模拟生成提示词（mock）
    const mockResult = {
      subject: "单人女性，面带微笑",
      scene: "白天室内，阳光透过窗户",
      style: "写实风格，短剧封面",
      color: "明亮温暖色调，局部柔和高对比",
      composition: "中景特写，人物占画面60%",
      lighting: "自然光，柔和阴影",
      details: "背景简洁，人物服饰清晰，画面干净"
    };

    const resultText = `【主体内容】
${mockResult.subject}

【场景设定】
${mockResult.scene}

【整体风格】
${mockResult.style}

【色调与色彩】
${mockResult.color}

【构图与视角】
${mockResult.composition}

【光影与质感】
${mockResult.lighting}

【细节补充】
${mockResult.details}`;

    // 模拟延迟，感觉像真实调用
    await new Promise((resolve) => setTimeout(resolve, 500));

    res.status(200).json({ result: resultText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "服务器内部错误" });
  }
}
