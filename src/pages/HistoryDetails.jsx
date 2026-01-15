import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useOcrStore from "../store/ocrStore";

import "./HistoryDetails.scss";
import renderObject from "./HistoryDynamicForm";

const HistoryDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const lang = i18n.language || "en";

  const { loadOcrById, result, isLoading } = useOcrStore();

  useEffect(() => {
    loadOcrById(Number(id));
  }, [id]);

  if (isLoading) return <p>{t("common.loading")}</p>;

  if (!result?.ocr) return <p>{t("history.no_data")}</p>;

  return (
    <div className="history-details-page">
      <button className="back-btn" onClick={() => navigate("/history")}>
        ← {t("history_details.back_to_history")}
      </button>

      <h2>{t("history_details.details_title")}</h2>

      <div className="history-preview">
        {renderObject(result.ocr, () => {}, "", lang, true)}
      </div>
    </div>
  );
};

export default HistoryDetails;
