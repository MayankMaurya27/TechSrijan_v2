import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const ALLOWED_EXTS = new Set([".webp", ".png", ".jpg", ".jpeg", ".svg", ".gif"]);

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file.startsWith(".")) continue;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (ALLOWED_EXTS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

async function uploadFile(filePath, index, total) {
  const relPath = path.relative(PUBLIC_DIR, filePath);
  const ext = path.extname(relPath);
  // Public ID without extension so Cloudinary can dynamically transform format
  const publicId = `techsrijan/${relPath.slice(0, -ext.length)}`;

  try {
    const res = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      resource_type: "image",
    });
    console.log(`[${index + 1}/${total}] ✓ ${relPath} ➔ ${res.secure_url}`);
    return true;
  } catch (err) {
    console.error(`[${index + 1}/${total}] ✗ Failed: ${relPath} - ${err.message}`);
    return false;
  }
}

async function main() {
  const files = getFiles(PUBLIC_DIR);
  console.log(`Starting Cloudinary upload: ${files.length} assets found in public/...`);

  // Concurrency limit of 5
  const CONCURRENCY = 5;
  let currentIndex = 0;
  let successCount = 0;

  async function worker() {
    while (currentIndex < files.length) {
      const i = currentIndex++;
      const success = await uploadFile(files[i], i, files.length);
      if (success) successCount++;
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  console.log(`\n🎉 Upload complete! ${successCount}/${files.length} assets successfully hosted on Cloudinary.`);
}

main();
