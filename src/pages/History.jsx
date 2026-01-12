import { useTranslation } from "react-i18next";
import "./History.scss";

const History = () => {
  const { t } = useTranslation();

  return (
    <div className="history-page">
      <div className="history-header">
        <h2>{t("history.title")}</h2>
        <p>{t("history.subtitle")}</p>
      </div>

      <div className="history-card">
        <table className="history-table">
          <thead>
            <tr>
              <th>{t("history.document")}</th>
              <th>{t("history.type")}</th>
              <th>{t("history.status")}</th>
              <th>{t("history.date")}</th>
              <th>{t("history.action")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Invoice_001.pdf</td>
              <td>Invoice</td>
              <td>
                <span className="status success">
                  {t("history.completed")}
                </span>
              </td>
              <td>2026-01-12</td>
              <td>
                <button className="view-btn">
                  {t("history.view")}
                </button>
              </td>
            </tr>

            <tr>
              <td>Quotation_A.png</td>
              <td>Quotation</td>
              <td>
                <span className="status pending">
                  {t("history.pending")}
                </span>
              </td>
              <td>2026-01-11</td>
              <td>
                <button className="view-btn">
                  {t("history.view")}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
