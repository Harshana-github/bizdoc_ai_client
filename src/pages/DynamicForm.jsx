import "./DynamicForm.scss";

const isObject = (v) =>
  typeof v === "object" && v !== null && !Array.isArray(v);

/* --------------------- TABLE RENDERER --------------------- */
const renderTable = (key, items, onChange, path) => {
  const columns = Object.keys(items[0] || {});

  return (
    <div key={path} className="table-block">
      <h5>{key}</h5>

      <table className="editable-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {items.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((col) => {
                const cellPath = `${path}[${rowIndex}].${col}`;

                return (
                  <td key={cellPath}>
                    <input
                      type="text"
                      value={row[col] ?? ""}
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

/* --------------------- VALUE RENDERER --------------------- */
const renderValue = (key, value, onChange, path = "") => {
  const fieldPath = path ? `${path}.${key}` : key;

  // ARRAY → TABLE
  if (Array.isArray(value) && value.length && isObject(value[0])) {
    return renderTable(key, value, onChange, fieldPath);
  }

  // ARRAY (non-object)
  if (Array.isArray(value)) {
    return (
      <div key={fieldPath} className="array-block">
        <h5>{key}</h5>
        {value.map((item, index) => (
          <input
            key={`${fieldPath}[${index}]`}
            type="text"
            value={item}
            onChange={(e) => onChange(`${fieldPath}[${index}]`, e.target.value)}
          />
        ))}
      </div>
    );
  }

  // OBJECT
  if (isObject(value)) {
    return (
      <fieldset key={fieldPath}>
        <legend>{key}</legend>
        {Object.entries(value).map(([k, v]) =>
          renderValue(k, v, onChange, fieldPath)
        )}
      </fieldset>
    );
  }

  // PRIMITIVE
  return (
    <div key={fieldPath} className="form-group">
      <label>{key}</label>
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(fieldPath, e.target.value)}
      />
    </div>
  );
};

/* --------------------- ROOT --------------------- */
const renderObject = (obj, onChange, path = "") =>
  Object.entries(obj).map(([k, v]) => renderValue(k, v, onChange, path));

export default renderObject;
