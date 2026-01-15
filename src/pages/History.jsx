import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import useOcrStore from "../store/ocrStore";
import "./History.scss";
import { ROUTES } from "../routes/routes";

const History = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const {
    history = [],
    historyLoading,
    fetchHistory,
    loadOcrById,
  } = useOcrStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getDocumentType = (data) => {
    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data;
      return parsed?.document_type?.value ?? "-";
    } catch (e) {
      return "-";
    }
  };

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>{t("history.title")}</h2>
        <p>{t("history.subtitle")}</p>
      </div>

      <div className="history-card">
        {historyLoading ? (
          <p>{t("history.loading")}</p>
        ) : history.length === 0 ? (
          <p>{t("history.empty")}</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>{t("history.document")}</th>
                <th>{t("history.type")}</th>
                <th>{t("history.date")}</th>
                <th>{t("history.action")}</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => (
                <tr key={item.id}>
                  <td>
                    <a
                      href={`${process.env.REACT_APP_ASSET_BASE_URL}/storage/${item.file_path}`}
                      target="_blank"
                      className="file-link"
                      rel="noreferrer"
                    >
                      {item.file_path.split("/").pop()}
                    </a>
                  </td>
                  <td>{getDocumentType(item.data)}</td>
                  <td>{new Date(item.created_at).toLocaleDateString()}</td>
                  <td>
                    <Link
                      to={`${ROUTES.HISTORY}/${item.id}`}
                      className="view-btn"
                    >
                      {t("history.view")}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History;
