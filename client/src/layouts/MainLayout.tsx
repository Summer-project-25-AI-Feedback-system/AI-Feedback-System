import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../context/useUser";

export default function MainLayout() {
  const { user, isLogin, refreshUser, logout, login } = useUser();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAndRedirect = async () => {
      await refreshUser?.();
      if (user && location.pathname === "/") {
        navigate("/orgs");
      }
    };
    checkAndRedirect();
  }, [refreshUser, navigate, user, location.pathname]);

  const handleHeaderButtonClick = async () => {
    if (isLogin) {
      await logout?.();
      navigate("/");
    } else {
      const loginUrl = login?.();
      if (loginUrl) {
        window.location.href = loginUrl;
      }
    }
  };

  const fullWidthRoutes = [
    /^\/orgs\/[^/]+\/assignments$/,
  ];

  const isFullWidthLayout = fullWidthRoutes.some((regex) =>
    regex.test(location.pathname)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={!!isLogin} onClick={handleHeaderButtonClick} />
      <main className={isFullWidthLayout ? "" : "flex-1 flex justify-center items-start"}>
        {isFullWidthLayout ? (
          <Outlet />
        ) : (
          <div className="w-full max-w-screen-xl">
            <Outlet />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}