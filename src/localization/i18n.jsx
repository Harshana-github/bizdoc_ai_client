import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import HeaderEN from "./locales/en/header.json";
import SidebarEN from "./locales/en/side-bar.json";
import DashboardEN from "./locales/en/dashboard.json";
import AuthEN from "./locales/en/auth.json";

import HeaderJP from "./locales/ja/header.json";
import SidebarJP from "./locales/ja/side-bar.json";
import DashboardJP from "./locales/ja/dashboard.json";
import AuthJP from "./locales/ja/auth.json";

const resources = {
  en: {
    translation: {
      ...HeaderEN,
      ...SidebarEN,
      ...DashboardEN,
      ...AuthEN,
    },
  },
  ja: {
    translation: {
      ...HeaderJP,
      ...SidebarJP,
      ...DashboardJP,
      ...AuthJP,
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "ja",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
