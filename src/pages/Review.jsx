import { useTranslation } from "react-i18next";
import useOcrStore from "../store/ocrStore";
import "./Review.scss";

const Review = () => {
  const { t } = useTranslation();
  const { result } = useOcrStore();

  const file = result?.file;

  return (
    <div className="review-page">
      {/* HEADER */}
      <div className="review-header">
        <div className="review-header-left">
          <h2>{t("review.title")}</h2>
          <p>{t("review.subtitle")}</p>
        </div>

        <div className="review-header-actions">
          <button className="btn secondary">
            {t("review.reprocess")}
          </button>

          <button className="btn primary">
            {t("review.confirm")}
          </button>

          <button className="btn outline">
            {t("review.export")}
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="review-body">
        {/* LEFT: Original document preview */}
        <div className="review-panel document-view">
          <h4>{t("review.original")}</h4>

          {!file && (
            <div className="document-placeholder">
              📄 {t("review.preview")}
            </div>
          )}

          {file && file.type.startsWith("image") && (
            <img
              src={file.preview_url}
              alt={file.original_name}
              className="review-image"
            />
          )}

          {file && file.type === "application/pdf" && (
            <iframe
              src={file.preview_url}
              title="PDF Preview"
              className="review-pdf"
            />
          )}
        </div>

        {/* RIGHT: Extracted data */}
        <div className="review-panel data-view">
          <h4>{t("review.extracted")}</h4>

          <div className="form-group">
            <label>{t("review.invoiceNo")}</label>
            <input type="text" defaultValue="INV-00123" />
          </div>

          <div className="form-group">
            <label>{t("review.date")}</label>
            <input type="date" defaultValue="2026-01-12" />
          </div>

          <div className="form-group">
            <label>{t("review.customer")}</label>
            <input type="text" defaultValue="ABC Corporation" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Review;
