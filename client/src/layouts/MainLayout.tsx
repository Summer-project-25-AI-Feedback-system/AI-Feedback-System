import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../context/useUser";

export default function MainLayout() {
  const { user, isLogin, refreshUser, logout, login } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  const isLoginPage = location.pathname === "/";
  const initialLoad = useRef(true); // Add this ref
  const isLoggingOut = useRef(false); // Track logout state

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoggingOut.current) return;
      if (initialLoad.current || location.pathname === "/") {
        await refreshUser?.();
        initialLoad.current = false;
      }

      // Redirect logic
      if (user && location.pathname === "/") {
        navigate("/orgs");
      }
    };

    checkAuth();
  }, [refreshUser, navigate, user, location.pathname]);

  const handleLogout = async () => {
    isLoggingOut.current = true; // Set logout flag
    if (isLogin) {
      await logout?.();
      navigate("/", { replace: true });
    } else {
      const loginUrl = login?.();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
    isLoggingOut.current = false; // Reset logout flag
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={!!isLogin} onClick={handleLogout} />
      <main
        className={`flex-1 flex justify-center ${
          isLoginPage ? "items-center" : "items-start"
        }`}
      >
        <div className="w-full max-w-screen-xl">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
