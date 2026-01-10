import { useTranslation } from "react-i18next";
import "./LanguageSwitcher.scss";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
      <button
        className={i18n.language === "en" ? "active" : ""}
        onClick={() => changeLanguage("en")}
        title="English"
      >
        🇬🇧
      </button>

      <button
        className={i18n.language === "ja" ? "active" : ""}
        onClick={() => changeLanguage("ja")}
        title="日本語"
      >
        🇯🇵
      </button>
    </div>
  );
};

export default LanguageSwitcher;
