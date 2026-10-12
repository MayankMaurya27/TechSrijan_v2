import fs from "fs";
import path from "path";

/**
 * Robust server-side environment resolver.
 * 1. Checks process.env
 * 2. If not present (e.g. dev server started before .env was created),
 *    safely parses .env.local and .env directly from the project root.
 * Automatically sanitizes accidentally prepended protocols like 'https://' from Client IDs.
 * ZERO hardcoded secrets. 100% compliant with GitHub Push Protection.
 */
export function getServerEnv(key: string): string | undefined {
  let val = process.env[key];

  if (!val) {
    try {
      for (const fileName of [".env.local", ".env"]) {
        const filePath = path.join(process.cwd(), fileName);
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf-8");
          const match = fileContent.match(new RegExp(`^${key}=(.*)$`, "m"));
          if (match && match[1]) {
            val = match[1].trim().replace(/^["']|["']$/g, "");
            if (val) break;
          }
        }
      }
    } catch {
      // Fail silently in environments where fs is restricted
    }
  }

  if (val) {
    val = val.trim();
    // If an OAuth Client ID was accidentally prefixed with http(s):// in dashboard envs, sanitize it
    if (key.includes("CLIENT_ID") && /^https?:\/\//i.test(val)) {
      val = val.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    }
    process.env[key] = val;
    return val;
  }

  return undefined;
}
