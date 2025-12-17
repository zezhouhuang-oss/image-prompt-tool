/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // 改成你需要的大小
    },
  },
};

module.exports = nextConfig;
