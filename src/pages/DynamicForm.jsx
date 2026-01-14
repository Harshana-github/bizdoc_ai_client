import "./DynamicForm.scss";

const isObject = (v) =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/* ---------------- TABLE ---------------- */
const renderTable = (label, rows, onChange, path, lang, readOnly) => {
  const columns = Object.keys(rows[0] || {});

  return (
    <div key={path} className="table-block">
      <h5>{label}</h5>

      <table className="editable-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{rows[0][col]?.label?.[lang] ?? col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => {
                const cellPath = `${path}[${rowIndex}].${col}.value`;

                return (
                  <td key={cellPath}>
                    <input
                      type="text"
                      value={row[col]?.value ?? ""}
                      readOnly={readOnly}
                      disabled={readOnly}
                      onChange={(e) => onChange(cellPath, e.target.value)}
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ---------------- FIELD ---------------- */
const renderField = (key, field, onChange, path, lang, readOnly) => {
  if (Array.isArray(field) && field.length && isObject(field[0])) {
    return renderTable(key, field, onChange, `${path}.${key}`, lang);
  }

  const label = field?.label?.[lang] ?? key;
  const value = field?.value;
  const fieldPath = path ? `${path}.${key}` : key;

  if (Array.isArray(value) && value.length && isObject(value[0])) {
    return renderTable(
      label,
      value,
      onChange,
      `${fieldPath}.value`,
      lang,
      readOnly
    );
  }

  if (isObject(value)) {
    return (
      <fieldset key={fieldPath}>
        <legend>{label}</legend>
        {Object.entries(value).map(([k, v]) =>
          renderField(k, v, onChange, fieldPath, lang, readOnly)
        )}
      </fieldset>
    );
  }

  return (
    <div key={fieldPath} className="form-group">
      <label>{label}</label>
      <input
        type="text"
        value={value ?? ""}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(e) => onChange(`${fieldPath}.value`, e.target.value)}
      />
    </div>
  );
};

/* ---------------- ROOT ---------------- */
const renderObject = (obj, onChange, path = "", lang = "en", readOnly = false) =>
  Object.entries(obj).map(([k, v]) => renderField(k, v, onChange, path, lang, readOnly));

export default renderObject;
