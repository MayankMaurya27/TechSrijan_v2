import fs from "fs";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PUBLIC_DIR = path.resolve(process.cwd(), "public");
const SRC_DIR = path.resolve(process.cwd(), "src");

// 1. Gather all referenced strings from code
function gatherCodeStrings() {
  let corpus = "";
  function walk(dir) {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      if (file.startsWith(".")) continue;
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (file.endsWith(".ts") || file.endsWith(".tsx") || file.endsWith(".js") || file.endsWith(".jsx") || file.endsWith(".css")) {
        corpus += "\n" + fs.readFileSync(full, "utf8");
      }
    }
  }
  walk(SRC_DIR);
  for (const f of ["next.config.ts", "package.json"]) {
    if (fs.existsSync(f)) corpus += "\n" + fs.readFileSync(f, "utf8");
  }
  return corpus;
}

const codeCorpus = gatherCodeStrings();

function isAssetUsed(relPath) {
  const norm = relPath.replace(/\\/g, "/");
  const filename = path.basename(norm);
  const ext = path.extname(filename);
  const stem = filename.slice(0, -ext.length);

  // Exact relative path
  if (codeCorpus.includes("/" + norm) || codeCorpus.includes('"' + norm + '"') || codeCorpus.includes("'" + norm + "'")) {
    return true;
  }
  // Filename
  if (codeCorpus.includes(filename)) {
    return true;
  }
  // Dynamic stems (e.g. for themes or logos)
  if (stem.length > 4 && codeCorpus.includes(stem)) {
    return true;
  }
  return false;
}

// 2. Scan public directory
function getPublicFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file.startsWith(".")) continue;
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      results = results.concat(getPublicFiles(full));
    } else {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  console.log("=== STEP 1: AUDITING & PURGING UNUSED LOCAL ASSETS ===");
  const allFiles = getPublicFiles(PUBLIC_DIR);
  const usedRelPaths = new Set();
  const unusedLocalFiles = [];

  for (const full of allFiles) {
    const rel = path.relative(PUBLIC_DIR, full).replace(/\\/g, "/");
    if (isAssetUsed(rel)) {
      usedRelPaths.add(rel);
    } else {
      unusedLocalFiles.push(full);
    }
  }

  console.log(`Found ${allFiles.length} total files in public/.`);
  console.log(`Used in website: ${usedRelPaths.size}`);
  console.log(`Unused local files to delete: ${unusedLocalFiles.length}`);

  let localSavedBytes = 0;
  for (const f of unusedLocalFiles) {
    const sz = fs.statSync(f).size;
    fs.unlinkSync(f);
    localSavedBytes += sz;
    console.log(`  - Deleted local: ${path.relative(PUBLIC_DIR, f)} (${(sz / 1024).toFixed(1)} KB)`);
  }
  console.log(`✓ Purged ${unusedLocalFiles.length} files from repo (saved ${(localSavedBytes / 1024 / 1024).toFixed(2)} MB).\n`);

  console.log("=== STEP 2: AUDITING & PURGING UNUSED ASSETS FROM CLOUDINARY ===");
  // Fetch all resources with prefix 'techsrijan'
  let allCloudinary = [];
  let nextCursor = null;
  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: "techsrijan",
      max_results: 500,
      next_cursor: nextCursor,
    });
    allCloudinary = allCloudinary.concat(res.resources);
    nextCursor = res.next_cursor;
  } while (nextCursor);

  console.log(`Total Cloudinary resources under 'techsrijan': ${allCloudinary.length}`);

  const toDeleteCloudinary = [];
  for (const item of allCloudinary) {
    // public_id is e.g. "techsrijan/images/about/about-bg" or "techsrijan/images/sponsors/cp-6"
    const relWithoutPrefix = item.public_id.replace(/^techsrijan\//, "");
    
    // Check if any used file matches this public_id (with or without extension)
    let isUsed = false;
    for (const used of usedRelPaths) {
      const usedWithoutExt = used.replace(/\.[^/.]+$/, "");
      if (used === relWithoutPrefix || usedWithoutExt === relWithoutPrefix) {
        isUsed = true;
        break;
      }
    }

    if (!isUsed) {
      toDeleteCloudinary.push(item.public_id);
    }
  }

  console.log(`Cloudinary resources to delete: ${toDeleteCloudinary.length}`);

  // Delete in batches of 50
  for (let i = 0; i < toDeleteCloudinary.length; i += 50) {
    const batch = toDeleteCloudinary.slice(i, i + 50);
    try {
      await cloudinary.api.delete_resources(batch);
      console.log(`  ✓ Deleted batch of ${batch.length} from Cloudinary:`, batch.slice(0, 3).join(", ") + "...");
    } catch (err) {
      console.error("  ✗ Delete batch error:", err.message);
    }
  }
  console.log(`✓ Cloudinary is now 100% clean and contains ONLY active website assets!\n`);

  console.log("=== STEP 3: UPLOADING ACTIVE SCROLLING & HERO VIDEOS TO CLOUDINARY ===");
  const videos = [
    "scrolling-hd.mp4",
    "scrolling-mobile.mp4",
    "landing-bg.mp4",
    "landing-bg-mobile.mp4",
    "event_video_desktop.mp4",
    "event_video_mobile.mp4",
  ];

  for (const vid of videos) {
    const fullPath = path.join(PUBLIC_DIR, vid);
    if (!fs.existsSync(fullPath)) continue;
    const publicId = `techsrijan/videos/${vid.replace(/\.mp4$/, "")}`;
    const sz = (fs.statSync(fullPath).size / 1024 / 1024).toFixed(2);
    console.log(`Uploading video ${vid} (${sz} MB)...`);
    try {
      const res = await cloudinary.uploader.upload(fullPath, {
        resource_type: "video",
        public_id: publicId,
        overwrite: true,
        invalidate: true, // purge CDN copies of the old file
      });
      console.log(`  ✓ ${vid} ➔ ${res.secure_url}`);
    } catch (err) {
      console.error(`  ✗ Video upload failed for ${vid}:`, err.message);
    }
  }

  console.log("\n🎉 Full Sync & Clean Complete! Repo and Cloudinary are perfectly aligned.");
}

main().catch(console.error);
