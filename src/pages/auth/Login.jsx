import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Login.scss";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { login, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    clearError?.();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(form);
      navigate("/"); // or /dashboard
    } catch (e) {
      // error handled in store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t("auth.login")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input
              type="email"
              name="email"
              placeholder="example@mail.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("auth.password")}</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="auth-btn" disabled={isLoading}>
            {isLoading ? t("auth.loading") : t("auth.login")}
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
