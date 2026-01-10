import { useTranslation } from "react-i18next";

const Dashboard = () => {
  const { t } = useTranslation();

  return (
    <div className="dashboard-page">
      <h2>{t("dashboard.title")}</h2>
      <p>{t("dashboard.welcome")}</p>
      <p>{t("dashboard.description")}</p>
    </div>
  );
};

export default Dashboard;
