import * as XLSX from "xlsx";

/* ============================================================
   NORMALIZE FOR EXCEL (FIELDS + TABLES)
   ============================================================ */
function normalizeDocument(doc, lang = "en") {
  const fields = [];
  const tables = {};

  function walk(node, section = "") {
    if (!node || typeof node !== "object") return;

    // SECTION
    if (
      node.label &&
      node.value &&
      typeof node.value === "object" &&
      !Array.isArray(node.value)
    ) {
      const nextSection = node.label[lang] || section;
      walk(node.value, nextSection);
      return;
    }

    // TABLE
    if (node.label && Array.isArray(node.value)) {
      const tableName = node.label[lang] || "Table";

      tables[tableName] = node.value.map((row) => {
        const flatRow = {};
        Object.values(row).forEach((cell) => {
          const header = cell.label?.[lang];
          if (header) {
            flatRow[header] = cell.value ?? "";
          }
        });
        return flatRow;
      });
      return;
    }

    // FIELD (leaf or group)
    if (node.label && Object.prototype.hasOwnProperty.call(node, "value")) {
      const value = node.value;

      // LEAF FIELD
      if (value === null || typeof value !== "object") {
        fields.push({
          Section: section,
          Field: node.label?.[lang] ?? "",
          Value: value ?? "",
        });
        return;
      }

      // GROUP FIELD
      Object.values(value).forEach((v) => walk(v, section));
      return;
    }

    // FALLBACK
    Object.values(node).forEach((v) => walk(v, section));
  }

  walk(doc);
  return { fields, tables };
}

/* ============================================================
   NORMALIZE FOR CSV (SINGLE FLAT FILE)
   ============================================================ */
function normalizeForCSV(doc, lang = "en") {
  const rows = [];

  function walk(node, section = "") {
    if (!node || typeof node !== "object") return;

    // SECTION
    if (
      node.label &&
      node.value &&
      typeof node.value === "object" &&
      !Array.isArray(node.value)
    ) {
      const nextSection = node.label[lang] || section;
      walk(node.value, nextSection);
      return;
    }

    // TABLE → each cell becomes a row
    if (node.label && Array.isArray(node.value)) {
      const tableName = node.label?.[lang] || "Table";

      node.value.forEach((row, rowIndex) => {
        Object.values(row).forEach((cell) => {
          rows.push({
            Section: section,
            Type: "TABLE",
            Table: tableName,
            Row: rowIndex + 1,
            Field: cell.label?.[lang] ?? "",
            Value: cell.value ?? "",
          });
        });
      });
      return;
    }

    // FIELD
    if (node.label && Object.prototype.hasOwnProperty.call(node, "value")) {
      const value = node.value;

      if (value === null || typeof value !== "object") {
        rows.push({
          Section: section,
          Type: "FIELD",
          Table: "",
          Row: "",
          Field: node.label?.[lang] ?? "",
          Value: value ?? "",
        });
        return;
      }

      Object.values(value).forEach((v) => walk(v, section));
      return;
    }

    Object.values(node).forEach((v) => walk(v, section));
  }

  walk(doc);
  return rows;
}

/* ============================================================
   EXPORT TO EXCEL (.xlsx)
   ============================================================ */
export function exportToExcel(doc, lang = "en") {
  const { fields, tables } = normalizeDocument(doc, lang);
  const workbook = XLSX.utils.book_new();

  // MAIN DOCUMENT SHEET
  const fieldSheet = XLSX.utils.json_to_sheet(fields);
  XLSX.utils.book_append_sheet(workbook, fieldSheet, "Document");

  // TABLE SHEETS
  Object.entries(tables).forEach(([name, rows]) => {
    if (!rows.length) return;

    const sheet = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(
      workbook,
      sheet,
      name.substring(0, 31) // Excel limit
    );
  });

  XLSX.writeFile(workbook, "document.xlsx");
}

/* ============================================================
   EXPORT TO CSV (SINGLE FILE – FIELDS + TABLES)
   ============================================================ */
export function exportToCSV(doc, lang = "en") {
  const rows = normalizeForCSV(doc, lang);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(worksheet);

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  downloadFile(url, "document.csv");
}

/* ============================================================
   DOWNLOAD HELPER
   ============================================================ */
function downloadFile(url, filename) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
