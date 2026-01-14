import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useOcrStore from "../store/ocrStore";
import renderObject from "./DynamicForm";
import { exportToCSV, exportToExcel } from "../utils/exportUtils";
import "./Review.scss";

const DataLoader = () => {
  const { t } = useTranslation();

  return (
    <div className="data-loader">
      <div className="spinner" />
      <p>{t("review.extracting")}</p>
    </div>
  );
};

const Review = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";

  const { result, processOcr, isLoading } = useOcrStore();
  const file = result?.file;
  const ocr = result?.ocr;

  const [formData, setFormData] = useState({});
  const [showExport, setShowExport] = useState(false);

  useEffect(() => {
    try {
      if (!ocr || ocr.error) return;
      const content = ocr?.data?.choices?.[0]?.message?.content;
      if (!content) return;

      const clean = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setFormData(parsed);
    } catch (err) {
      console.error("Failed to parse OCR JSON", err);
      setFormData({});
    }
  }, [ocr]);

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);

      const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");

      let obj = updated;
      keys.slice(0, -1).forEach((k) => {
        if (!obj[k]) obj[k] = {};
        obj = obj[k];
      });

      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleReprocess = async () => {
    try {
      setFormData({});
      await processOcr();
    } catch (err) {
      console.error("Reprocess failed", err);
    }
  };

  const handleExport = (type) => {
    if (type === "csv") {
      exportToCSV(formData);
    } else {
      exportToExcel(formData);
    }
    setShowExport(false);
  };

  return (
    <div className="review-page">
      <div className="review-header">
        <div>
          <h2>{t("review.title")}</h2>
          <p>{t("review.subtitle")}</p>
        </div>

        <div className="review-header-actions">
          <button
            className="btn secondary"
            onClick={handleReprocess}
            disabled={isLoading}
          >
            {isLoading ? t("review.processing") : t("review.reprocess")}
          </button>

          <button className="btn primary">{t("review.confirm")}</button>

          <button className="btn outline" onClick={() => setShowExport(true)}>
            {t("review.export")}
          </button>
        </div>
      </div>

      <div className="review-body">
        <div className="review-panel document-view">
          <h4>{t("review.original")}</h4>

          {!file && <div className="document-placeholder">📄</div>}

          {file?.type?.startsWith("image") && (
            <img
              src={file.preview_url}
              alt="Document"
              className="review-image"
            />
          )}

          {file?.type === "application/pdf" && (
            <iframe
              src={file.preview_url}
              title="PDF Preview"
              className="review-pdf"
            />
          )}
        </div>

        <div className="review-panel data-view">
          <h4>{t("review.extracted")}</h4>

          {isLoading ? (
            <DataLoader />
          ) : Object.keys(formData).length === 0 ? (
            <p>No data extracted</p>
          ) : (
            renderObject(formData, handleChange, "", lang)
          )}
        </div>
      </div>

      {showExport && (
        <div className="export-modal">
          <div className="export-box">
            <h4>{t("review.export")}</h4>
            <button onClick={() => handleExport("excel")}>Excel (.xlsx)</button>
            <button onClick={() => handleExport("csv")}>CSV (.csv)</button>
            <button onClick={() => setShowExport(false)}>
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
