import { useTranslation } from "react-i18next";
import { MdLanguage } from "react-icons/md";
import "./LanguageSwitcher.scss";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="language-switcher">
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
    </div>
  );
};

export default LanguageSwitcher;
