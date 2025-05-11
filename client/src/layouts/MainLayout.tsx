import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useUser } from "../context/useUser";

export default function MainLayout() {
  const userContext = useUser();
  const { user, loggedIn, refreshUser, logout } = userContext ?? {};

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    refreshUser?.().then(() => {
      if (user && location.pathname === "/") {
        navigate("/repos");
      }
    });
  }, [refreshUser, navigate, user, location.pathname]);

  const handleHeaderButtonClick = async () => {
    if (loggedIn) {
      await logout?.();
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={!!loggedIn} onClick={handleHeaderButtonClick} />
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
