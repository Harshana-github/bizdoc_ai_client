import { Routes, Route } from "react-router-dom";
import { ROUTES } from "./routes";

import Layout from "../components/Layout";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";

import Dashboard from "../pages/Dashboard";
import Upload from "../pages/Upload";
import Review from "../pages/Review";
import History from "../pages/History";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.SIGNUP} element={<Signup />} />

      <Route element={<Layout />}>
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.UPLOAD} element={<Upload />} />
        <Route path={ROUTES.REVIEW} element={<Review />} />
        <Route path={ROUTES.HISTORY} element={<History />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
