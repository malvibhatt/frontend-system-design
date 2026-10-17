import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "./components/Sidebar.jsx";
import { allRoutes } from "./routes.jsx";

export default function App() {
  const { pathname } = useLocation();

  // Each page is a fresh document, start it at the top.
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <div className="shell">
      <Sidebar />
      <main className="main">
        <Routes>
          {allRoutes.map((r) => (
            <Route key={r.path} path={r.path} element={r.el} />
          ))}
        </Routes>
      </main>
    </div>
  );
}
