import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./Sidebar.scss";
import { ROUTES } from "../routes/routes";
import useSystemSettingStore from "../store/useSystemSettingStore";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { companyName } = useSystemSettingStore();

  const renderCompanyName = () => {
    if (!companyName) return t("dashboard.loading");

    const parts = companyName.trim().split(" ");

    // Only one word → normal display
    if (parts.length === 1) {
      return companyName;
    }

    return (
      <>
        {parts.slice(0, -1).join(" ")} <span>{parts[parts.length - 1]}</span>
      </>
    );
  };

  return (
    <div className="sidebar-container">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className={`sidebar-header ${collapsed ? "collapsed" : ""}`}>
          {!collapsed && (
            <div className="sidebar-logo" onClick={(e) => navigate("/")}>
              {renderCompanyName()}
            </div>
          )}

          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed(!collapsed)}
          >
            ☰
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to={ROUTES.DASHBOARD} className="sidebar-link">
            <span className="icon">🏠</span>
            {!collapsed && (
              <span className="text">{t("side-bar.dashboard")}</span>
            )}
          </NavLink>

          <NavLink to={ROUTES.UPLOAD} className="sidebar-link">
            <span className="icon">📤</span>
            {!collapsed && <span className="text">{t("side-bar.upload")}</span>}
          </NavLink>

          <NavLink to={ROUTES.HISTORY} className="sidebar-link">
            <span className="icon">📄</span>
            {!collapsed && (
              <span className="text">{t("side-bar.history")}</span>
            )}
          </NavLink>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
