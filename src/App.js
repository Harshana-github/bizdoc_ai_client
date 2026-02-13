import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import useSystemSettingStore from "./store/useSystemSettingStore";
import { useEffect } from "react";

const App = () => {
  const { fetchCompanyName, companyName } = useSystemSettingStore();

  useEffect(() => {
    fetchCompanyName();
  }, [fetchCompanyName]);

  useEffect(() => {
    if (companyName) {
      document.title = companyName;
    }
  }, [companyName]);
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export default App;
