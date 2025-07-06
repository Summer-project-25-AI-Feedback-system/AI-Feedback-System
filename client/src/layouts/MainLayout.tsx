import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../context/useUser";

export default function MainLayout() {
  const { user, refreshUser, logout, login } = useUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isLoginPage = pathname === "/";

  // auth status management
  useEffect(() => {
    const checkAuth = async () => {
      await refreshUser?.();

      // redirect after login
      if (user && pathname === "/") {
        navigate("/orgs");
      }
    };

    // only check auth in login page
    if (pathname === "/") {
      checkAuth();
    }
  }, [pathname, user, refreshUser, navigate]);

  const handleAuthAction = async () => {
    if (user) {
      await logout?.();
      navigate("/", { replace: true });
    } else {
      window.location.href = login?.() || "/";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={!!user} onClick={handleAuthAction} />
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
