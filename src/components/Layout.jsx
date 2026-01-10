import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "./Layout.scss";

const Layout = () => {
  return (
    <div className="layout-container">
      <div className="layout">
        <Sidebar />
        <div className="layout-main">
          <Header />
          <main className="layout-content">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
