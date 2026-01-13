import { useState } from "react";
import { useTranslation } from "react-i18next";
import useOcrStore from "../store/ocrStore";
import renderObject from "./DynamicForm";
import "./Review.scss";

const Review = () => {
  const { t } = useTranslation();
  const { result } = useOcrStore();

  const file = result?.file;
  const ocr = result?.ocr;

  let initialData = {};
  try {
    const content = ocr?.data?.choices?.[0]?.message?.content || "";
    const clean = content.replace(/```json|```/g, "").trim();
    initialData = JSON.parse(clean);
  } catch (e) {
    console.error("Failed to parse OCR JSON");
  }

  const [formData, setFormData] = useState(initialData);

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const updated = structuredClone(prev);
      const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let obj = updated;
      keys.slice(0, -1).forEach((k) => (obj = obj[k]));
      obj[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  return (
    <div className="review-page">
      <div className="review-header">
        <div>
          <h2>{t("review.title")}</h2>
          <p>{t("review.subtitle")}</p>
        </div>

        <div className="review-header-actions">
          <button className="btn secondary">{t("review.reprocess")}</button>
          <button className="btn primary">{t("review.confirm")}</button>
          <button className="btn outline">{t("review.export")}</button>
        </div>
      </div>

      <div className="review-body">
        <div className="review-panel document-view">
          <h4>{t("review.original")}</h4>

          {!file && <div className="document-placeholder">📄</div>}

          {file?.type.startsWith("image") && (
            <img src={file.preview_url} className="review-image" />
          )}

          {file?.type === "application/pdf" && (
            <iframe src={file.preview_url} className="review-pdf" />
          )}
        </div>

        {/* DYNAMIC FORM */}
        <div className="review-panel data-view">
          <h4>{t("review.extracted")}</h4>
          {renderObject(formData, handleChange)}
        </div>
      </div>
    </div>
  );
};

export default Review;
