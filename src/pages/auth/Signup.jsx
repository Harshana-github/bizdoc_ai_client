import { useState } from "react";
import { useTranslation } from "react-i18next";
import "./Signup.scss";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/useAuthStore";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { register, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
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
      await register(form);
      navigate("/"); // or /dashboard
    } catch (e) {
      // error already handled in store
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{t("auth.signup")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("auth.name")}</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>{t("auth.email")}</label>
            <input
              type="email"
              name="email"
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
            {isLoading ? t("auth.loading") : t("auth.signup")}
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
