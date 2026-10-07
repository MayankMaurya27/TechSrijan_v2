/**
 * Zero-Trust CSV Sanitizer & Generator (OWASP CWE-1236 Prevention)
 *
 * Prevents CSV / Formula Injection vulnerabilities when exported files
 * are opened in spreadsheet applications (Microsoft Excel, LibreOffice Calc,
 * Google Sheets, Apple Numbers).
 *
 * Dangerous trigger characters neutralized:
 *   = (Formula execution)
 *   + (Formula execution / operator)
 *   - (Formula execution / operator)
 *   @ (Formula execution / function invocation)
 *   \t (Tab character / field delimiter hijacking)
 *   \r (Carriage return / record hijacking)
 */

const DANGEROUS_FORMULA_REGEX = /^[\s\t\r\n]*[=+\-@\t\r]/;

/**
 * Sanitizes an individual CSV cell value.
 * If the value starts with any dangerous formula trigger, prefixes it with a single quote (').
 * Escapes internal quotes by doubling them (" -> "").
 * Encloses the cell in double quotes.
 */
export function sanitizeCsvField(val: unknown): string {
  if (val === null || val === undefined) {
    return '""';
  }

  const str = String(val);

  // If the cell contains formula triggers, prepend a single quote to force spreadsheet to treat it as literal text
  const neutralized = DANGEROUS_FORMULA_REGEX.test(str) ? `'${str}` : str;

  // Escape internal double quotes per RFC 4180
  const escaped = neutralized.replace(/"/g, '""');

  return `"${escaped}"`;
}

/**
 * Generates an RFC 4180-compliant, formula-injection-safe CSV string.
 * Automatically prepends UTF-8 Byte Order Mark (\uFEFF) for correct character encoding in Excel.
 */
export function generateSafeCsv(
  headers: string[],
  rows: (string | number | boolean | null | undefined)[][]
): string {
  const headerLine = headers.map((h) => sanitizeCsvField(h)).join(",");
  const dataLines = rows
    .map((row) => row.map((cell) => sanitizeCsvField(cell)).join(","))
    .join("\r\n");

  return `\uFEFF${headerLine}\r\n${dataLines}`;
}

/**
 * Triggers a browser download of a CSV file with automatic cleanup.
 */
export function downloadCsv(filename: string, csvContent: string): void {
  if (typeof window === "undefined") return;

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
