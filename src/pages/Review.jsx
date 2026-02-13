import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import useOcrStore from "../store/ocrStore";
import renderObject from "./DynamicForm";
import "./Review.scss";
import { useNavigate } from "react-router-dom";
import { FaSave, FaEdit } from "react-icons/fa";
import useSystemSettingStore from "../store/useSystemSettingStore";

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
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const lang = i18n.language || "en";
  const langKey = lang.startsWith("ja") ? "ja" : "en";

  const {
    result,
    processOcr,
    isLoading,
    saveOcrResult,
    savedOcrId,
    exportOcr,
    clearFile,
  } = useOcrStore();
  const { companyName } = useSystemSettingStore();
  const file = result?.file;
  const ocr = result?.ocr;

  const [formData, setFormData] = useState({});
  const [showExport, setShowExport] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [alert, setAlert] = useState(null);

  const documentType = formData?.document_type?.value?.toLowerCase() || "";
  const isQuotation = documentType === "quotation";

  useEffect(() => {
    try {
      if (!ocr || ocr.error) return;
      const content = ocr?.data?.choices?.[0]?.message?.content;
      if (!content) return;

      const clean = content.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);

      setFormData(parsed);
      setIsConfirmed(false);
    } catch (err) {
      console.error("Failed to parse OCR JSON", err);
      setFormData({});
    }
  }, [ocr]);

  const handleChange = (path, value) => {
    if (isConfirmed) return;

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

  const handleConfirm = () => {
    setIsConfirmed((prev) => {
      const next = !prev;

      showAlert(
        "success",
        next ? t("review.confirmed_success") : t("review.edit_mode"),
      );

      return next;
    });
  };

  const handleUploadClick = () => {
    clearFile();
    navigate("/upload");
    setFormData({});
  };

  const handleReprocess = async () => {
    try {
      setAlert(null);
      setFormData({});
      await processOcr();
    } catch (err) {
      console.error("Reprocess failed", err);
    }
  };

  const handleExport = async (type) => {
    try {
      const blob = await exportOcr({
        doc: formData,
        lang: langKey,
        type, // "excel" | "csv"
      });

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = type === "csv" ? "document.csv" : "document.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      showAlert("success", t("review.export_success"));
      setShowExport(false);
    } catch (err) {
      console.error("Export failed", err);
      showAlert("error", t("review.export_failed"), 5000);
    }
  };

  const handleSaveOrUpdate = async () => {
    try {
      await saveOcrResult(formData);

      showAlert(
        "success",
        savedOcrId ? t("review.updated_success") : t("review.saved_success"),
      );
    } catch (err) {
      showAlert("error", err?.message || t("review.save_failed"), 5000);
    }
  };

  const showAlert = (type, message, timeout = 3000) => {
    setAlert({ type, message });

    if (timeout) {
      setTimeout(() => {
        setAlert(null);
      }, timeout);
    }
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

          <button
            className={`btn ${isConfirmed ? "secondary" : "primary"}`}
            onClick={handleConfirm}
          >
            {isConfirmed ? t("review.edit") : t("review.confirm")}
          </button>

          <button className="btn outline" onClick={() => setShowExport(true)}>
            {t("review.export")}
          </button>
        </div>
      </div>

      <p className="info">{t("review.info", { company: companyName })}</p>
      {alert && (
        <div
          className={`upload-alert ${
            alert.type === "error" ? "error" : "success"
          }`}
        >
          <span className="alert-icon">
            {alert.type === "error" ? "❌" : "✅"}
          </span>

          <span className="alert-text">{alert.message}</span>

          <button className="alert-close" onClick={() => setAlert(null)}>
            ✕
          </button>
        </div>
      )}

      <div className="review-body">
        <div className="review-panel document-view">
          <div className="review-panel hedding-section">
            <h4>{t("review.original")}</h4>

            <button className="btn upload-btn" onClick={handleUploadClick}>
              {t("review.upload_new")}
            </button>
          </div>

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
          <div className="extracted-heading-section">
            <h4>{t("review.extracted")}</h4>
            <button
              className="icon-btn"
              aria-label={savedOcrId ? "Update" : "Save"}
              title={savedOcrId ? "Update" : "Save"}
              onClick={handleSaveOrUpdate}
              disabled={isLoading}
            >
              {savedOcrId ? <FaEdit size={16} /> : <FaSave size={16} />}
            </button>
          </div>
          {isLoading ? (
            <DataLoader />
          ) : Object.keys(formData).length === 0 ? (
            <p>No data extracted</p>
          ) : (
            renderObject(formData, handleChange, "", lang, isConfirmed)
          )}
        </div>
      </div>

      {showExport && (
        <div className="export-modal">
          <div className="export-box">
            <h4>{t("review.export")}</h4>
            {isQuotation && (
              <button
                className="template-btn"
                onClick={() => handleExport("template")}
              >
                {t("review.export_template")}
              </button>
            )}
            <button onClick={() => handleExport("excel")}>Excel (.xlsx)</button>
            <button onClick={() => handleExport("csv")}>CSV (.csv)</button>
            <button className="cancel-btn" onClick={() => setShowExport(false)}>
              {t("review.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
