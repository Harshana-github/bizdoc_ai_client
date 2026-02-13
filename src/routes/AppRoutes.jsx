import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";

import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import SystemSettings from "../pages/SystemSettings";

import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Review from "../pages/Review";
import History from "../pages/History";
import HistoryDetails from "../pages/HistoryDetails";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />
      <Route path={ROUTES.SYSTEM_SETTINGS} element={<SystemSettings />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.UPLOAD} element={<Upload />} />
          <Route path={ROUTES.REVIEW} element={<Review />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.HISTORY_DETAILS} element={<HistoryDetails />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
