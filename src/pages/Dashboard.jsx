import { useTranslation } from "react-i18next";
import "./Dashboard.scss";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>{t("dashboard.title")}</h2>
        <p className="dashboard-subtitle">{t("dashboard.welcome")}</p>
      </div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>{t("dashboard.totalDocs")}</h4>
          <span className="card-value">128</span>
        </div>
      </div>

      <div className="dashboard-info">
        <p>{t("dashboard.description")}</p>
      </div>
    </div>
  );
};

export default Dashboard;
