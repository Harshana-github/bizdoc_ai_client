import { useTranslation } from "react-i18next";
import "./Login.scss";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t("auth.login")}</h2>

        <form>
          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input type="email" placeholder="example@mail.com" />
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
            {t("auth.login")}
          </button>
        </form>

        <p className="auth-footer">
          {t("auth.noAccount")} <a href="/signup">{t("auth.signup")}</a>
        </p>
      </div>
      <LanguageSwitcher />
    </div>
  );
};

export default Login;
