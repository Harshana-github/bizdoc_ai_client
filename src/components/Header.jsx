import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ROUTE_TITLES } from "../routes/routes";
import useAuthStore from "../store/useAuthStore";
import { MdLanguage } from "react-icons/md";

import "./Header.scss";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { user, logout } = useAuthStore();

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const getTitleKey = () => {
    if (location.pathname.startsWith("/review")) {
      return "header.review";
    }
    return ROUTE_TITLES[location.pathname] || "header.dashboard";
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="header-container">
      <header className="header">
        <div className="header-left">
          <h3 className="header-title">{t(getTitleKey())}</h3>
        </div>

        <div className="header-right">
          <button
            className={`lang-btn ${i18n.language === "en" ? "active" : ""}`}
            onClick={() => changeLanguage("en")}
            title="English"
          >
            <MdLanguage size={18} />
            <span>EN</span>
          </button>

          <button
            className={`lang-btn ${i18n.language === "ja" ? "active" : ""}`}
            onClick={() => changeLanguage("ja")}
            title="日本語"
          >
            <MdLanguage size={18} />
            <span>日本語</span>
          </button>

          <div className="user-menu" ref={menuRef}>
            <span
              className="header-user"
              onClick={() => setShowMenu(!showMenu)}
            >
              {user?.name}
            </span>

            {showMenu && (
              <div className="user-dropdown">
                <button onClick={handleLogout}>{t("header.logout")}</button>
              </div>
            )}
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
