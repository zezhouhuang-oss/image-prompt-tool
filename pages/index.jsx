import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(reader.result);
    reader.readAsDataURL(file);
  };

  const generatePrompt = async () => {
    if (!image) return alert("请先上传图片");
    setLoading(true);
    try {
      const res = await fetch("/api/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: image })
      });
      const data = await res.json();
      if (res.ok) setResult(data.result);
      else alert(data.error || "生成失败");
    } catch (err) {
      alert("生成失败，请检查网络或 API 配置");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>图片风格提示词生成器</h1>
      <input type="file" accept="image/*" onChange={handleUpload} />
      <br /><br />
      {image && <img src={image} alt="preview" style={{ maxWidth: 300 }} />}
      <br /><br />
      <button onClick={generatePrompt} disabled={loading}>
        {loading ? "生成中..." : "生成提示词"}
      </button>
      <pre>{result}</pre>
    </div>
  );
}
