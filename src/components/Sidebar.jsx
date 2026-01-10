import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "./Sidebar.scss";
import { ROUTES } from "../routes/routes";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="sidebar-container">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className={`sidebar-header ${collapsed ? "collapsed" : ""}`}>
          {!collapsed && (
            <div className="sidebar-logo" onClick={(e) => navigate('/')}>
              BizDoc <span>AI</span>
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
