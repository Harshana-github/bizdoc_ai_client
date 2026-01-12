import { useTranslation } from "react-i18next";
import "./Review.scss";

const Review = () => {
  const { t } = useTranslation();

  return (
    <div className="review-page">
      <div className="review-header">
        <h2>{t("review.title")}</h2>
        <p>{t("review.subtitle")}</p>
      </div>

      <div className="review-body">
        <div className="review-panel document-view">
          <h4>{t("review.original")}</h4>
          <div className="document-placeholder">
            📄 {t("review.preview")}
          </div>
        </div>

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

      <div className="review-actions">
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
  );
};

export default Review;
