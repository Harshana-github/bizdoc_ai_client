import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SystemSettings.scss";
import LanguageSwitcher from "../components/LanguageSwitcher";
import useSystemSettingStore from "../store/useSystemSettingStore";

const SystemSettings = () => {
  const { t } = useTranslation();

  const {
    companyName,
    fetchCompanyName,
    updateCompanyName,
    clearOcrHistory,
    clearCache,
    runMigrations,
    isLoading,
    error,
    success,
    clearMessages,
  } = useSystemSettingStore();

  const [localCompanyName, setLocalCompanyName] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    fetchCompanyName();
  }, []);

  useEffect(() => {
    setLocalCompanyName(companyName);
  }, [companyName]);

  const handleConfirm = async () => {
    try {
      if (confirmAction === "history") await clearOcrHistory();
      if (confirmAction === "cache") await clearCache();
      if (confirmAction === "migrate") await runMigrations();
    } catch (e) {}

    setConfirmAction(null);
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h2>{t("settings.title")}</h2>
          <p>{t("settings.subtitle")}</p>
        </div>
        <LanguageSwitcher />
      </div>

      {(error || success) && (
        <div className={`settings-alert ${error ? "error" : "success"}`}>
          <span>{error || success}</span>
          <button onClick={clearMessages}>✕</button>
        </div>
      )}

      {/* Company Name */}
      <div className="settings-card">
        <h4>{t("settings.companyName")}</h4>
        <div className="settings-row">
          <input
            type="text"
            value={localCompanyName}
            onChange={(e) => setLocalCompanyName(e.target.value)}
          />
          <button
            className="btn primary"
            onClick={() => updateCompanyName(localCompanyName)}
            disabled={isLoading}
          >
            {isLoading ? t("auth.loading") : t("settings.save")}
          </button>
        </div>
      </div>

      {/* Clear History */}
      <div className="settings-card danger">
        <h4>{t("settings.clearHistoryTitle")}</h4>
        <p>{t("settings.clearHistoryDesc")}</p>
        <button
          className="btn danger"
          onClick={() => setConfirmAction("history")}
        >
          {t("settings.clearHistory")}
        </button>
      </div>

      {/* Clear Cache */}
      <div className="settings-card warning">
        <h4>{t("settings.clearRoutesTitle")}</h4>
        <p>{t("settings.clearRoutesDesc")}</p>
        <button
          className="btn warning"
          onClick={() => setConfirmAction("cache")}
        >
          {t("settings.clearRoutes")}
        </button>
      </div>

      {/* Run Migrations */}
      <div className="settings-card info">
        <h4>{t("settings.runMigrationsTitle")}</h4>
        <p>{t("settings.runMigrationsDesc")}</p>
        <button
          className="btn info"
          onClick={() => setConfirmAction("migrate")}
        >
          {t("settings.runMigrations")}
        </button>
      </div>

      {confirmAction && (
        <div className="confirm-modal">
          <div className="confirm-box">
            <h4>{t("settings.confirmTitle")}</h4>
            <p>{t("settings.areYouSure")}</p>

            <div className="confirm-actions">
              <button
                className="btn secondary"
                onClick={() => setConfirmAction(null)}
              >
                {t("settings.cancel")}
              </button>
              <button className="btn danger" onClick={handleConfirm}>
                {isLoading ? t("auth.loading") : t("settings.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
