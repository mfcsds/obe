/**
 * Karakter yang jika berada di awal sebuah cell CSV bisa dieksekusi sebagai
 * formula oleh Excel/Google Sheets (CSV/formula injection - OWASP A03).
 * Contoh payload berbahaya: `=cmd|'/c calc'!A1`.
 */
const FORMULA_TRIGGER_CHARS = ["=", "+", "-", "@"];

/**
 * Mengubah satu nilai field menjadi string CSV yang aman:
 * - Menetralkan formula injection dengan menambah prefix apostrof jika
 *   diawali karakter pemicu formula.
 * - Membungkus dengan tanda kutip dan escape kutip ganda jika field
 *   mengandung koma, kutip, atau newline.
 */
function toSafeCsvField(value: unknown): string {
  let text = value === null || value === undefined ? "" : String(value);

  if (FORMULA_TRIGGER_CHARS.some((char) => text.startsWith(char))) {
    text = `'${text}`;
  }

  const needsQuoting = /[",\n]/.test(text);
  if (needsQuoting) {
    text = `"${text.replace(/"/g, '""')}"`;
  }

  return text;
}

/**
 * Mengonversi array data menjadi konten CSV yang aman untuk dibuka di
 * Excel/Google Sheets, lalu memicu download-nya di browser.
 *
 * @param rows Data yang akan diekspor.
 * @param columns Definisi kolom: `header` untuk judul, `getValue` untuk
 *                mengambil nilai dari setiap row.
 * @param fileName Nama file unduhan, contoh: "data_mahasiswa.csv".
 */
export function exportRowsToCsv<T>(
  rows: T[],
  columns: Array<{ header: string; getValue: (row: T) => unknown }>,
  fileName: string
): void {
  const headerLine = columns.map((column) => toSafeCsvField(column.header)).join(",");
  const dataLines = rows.map((row) =>
    columns.map((column) => toSafeCsvField(column.getValue(row))).join(",")
  );
  const csvContent = [headerLine, ...dataLines].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
