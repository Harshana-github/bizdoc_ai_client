import * as XLSX from "xlsx";

/**
 * Flatten nested JSON into rows (best for CSV / Excel)
 */
export function flattenObject(obj, prefix = "", res = {}) {
  for (const key in obj) {
    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        flattenObject(item, `${newKey}[${index}]`, res);
      });
    } else if (typeof value === "object" && value !== null) {
      flattenObject(value, newKey, res);
    } else {
      res[newKey] = value;
    }
  }
  return res;
}

/**
 * Export JSON as CSV
 */
export function exportToCSV(data, filename = "document.csv") {
  const flat = flattenObject(data);
  const worksheet = XLSX.utils.json_to_sheet([flat]);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, filename);
}

/**
 * Export JSON as Excel
 */
export function exportToExcel(data, filename = "document.xlsx") {
  const flat = flattenObject(data);
  const worksheet = XLSX.utils.json_to_sheet([flat]);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, filename);
}

/**
 * Download helper
 */
function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
