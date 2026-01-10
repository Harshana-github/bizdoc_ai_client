import { useTranslation } from "react-i18next";
import "./Signup.scss";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t("auth.signup")}</h2>

        <form>
          <div className="form-group">
            <label>{t("auth.name")}</label>
            <input type="text" />
          </div>

          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input type="email" />
          </div>

          <div className="form-group">
            <label>{t("auth.password")}</label>
            <input type="password" />
          </div>

          <button
            type="submit"
            className="auth-btn"
            onClick={(e) => navigate("/")}
          >
            {t("auth.signup")}
          </button>
        </form>

        <p className="auth-footer">
          {t("auth.haveAccount")} <a href="/login">{t("auth.login")}</a>
        </p>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default Signup;
