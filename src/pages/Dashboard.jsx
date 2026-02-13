import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useOcrStore from "../store/ocrStore";
import "./Dashboard.scss";
import useSystemSettingStore from "../store/useSystemSettingStore";

const Dashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { companyName } = useSystemSettingStore();

  const { fetchProcessCount, processCount, processCountLoading } =
    useOcrStore();

  useEffect(() => {
    fetchProcessCount();
  }, [fetchProcessCount]);

  const handleUpload = () => {
    navigate("/upload");
  };

  return (
    <div className="dashboard-page">
      {/* HERO SECTION */}
      <div className="dashboard-hero">
        <h1>{t("dashboard.title")}</h1>
        <p className="hero-subtitle">{t("dashboard.welcome", { company: companyName })}</p>

        <button className="hero-upload-btn" onClick={handleUpload}>
          📄 {t("dashboard.uploadNew")}
        </button>
      </div>

      {/* STATS */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>{t("dashboard.totalDocs")}</h4>
          <span className="card-value">
            {processCountLoading ? "—" : (processCount?.user ?? 0)}
          </span>
        </div>
      </div>

      {/* INFO */}
      <div className="dashboard-info">
        <p>{t("dashboard.description")}</p>
      </div>
    </div>
  );
};

export default Dashboard;
