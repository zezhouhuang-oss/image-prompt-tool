import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // 图片上传 + 压缩
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const compressImage = (file, maxWidth = 800, maxHeight = 800) => {
      return new Promise((resolve) => {
        const img = new Image();
        const reader = new FileReader();
        reader.onload = (event) => {
          img.src = event.target.result;
        };
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height);
            width *= scale;
            height *= scale;
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              const compressedReader = new FileReader();
              compressedReader.onload = (e) => resolve(e.target.result);
              compressedReader.readAsDataURL(blob);
            },
            "image/jpeg",
            0.7 // 压缩质量
          );
        };
        reader.readAsDataURL(file);
      });
    };

    const compressedBase64 = await compressImage(file);
    setImage(compressedBase64);
    setResult("");
  };

  // 点击生成提示词
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
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>图片风格提示词生成器</h1>

      <input type="file" accept="image/*" onChange={handleUpload} />
      <br /><br />

      {image && (
        <img
          src={image}
          alt="preview"
          style={{ maxWidth: 300, borderRadius: 8 }}
        />
      )}
      <br /><br />

      <button onClick={generatePrompt} disabled={loading} style={{
        padding: "10px 20px",
        borderRadius: 6,
        cursor: loading ? "not-allowed" : "pointer"
      }}>
        {loading ? "生成中..." : "生成提示词"}
      </button>

      <pre style={{
        marginTop: 20,
        padding: 10,
        backgroundColor: "#f5f5f5",
        borderRadius: 6,
        whiteSpace: "pre-wrap"
      }}>
        {result}
      </pre>
    </div>
  );
}
