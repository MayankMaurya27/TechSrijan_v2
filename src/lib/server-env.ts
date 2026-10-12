import fs from "fs";
import path from "path";

/**
 * Robust server-side environment resolver.
 * 1. Checks process.env
 * 2. If not present (e.g. dev server started before .env was created),
 *    safely parses .env.local and .env directly from the project root.
 * ZERO hardcoded secrets. 100% compliant with GitHub Push Protection.
 */
export function getServerEnv(key: string): string | undefined {
  if (process.env[key]) {
    return process.env[key];
  }

  try {
    for (const fileName of [".env.local", ".env"]) {
      const filePath = path.join(process.cwd(), fileName);
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const match = fileContent.match(new RegExp(`^${key}=(.*)$`, "m"));
        if (match && match[1]) {
          const val = match[1].trim().replace(/^["']|["']$/g, "");
          if (val) {
            process.env[key] = val; // Cache for subsequent accesses
            return val;
          }
        }
      }
    }
  } catch {
    // Fail silently in environments where fs is restricted
  }

  return undefined;
}
