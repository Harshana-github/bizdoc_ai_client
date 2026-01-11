import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user?.token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
