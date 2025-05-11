import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function MainLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${baseUrl}/api/auth/me`, { withCredentials: true })
      .then((res) => {
        console.log("Authenticated user data:", res.data);
        setLoggedIn(!!res.data.user);
        if (res.data.user) navigate("/repos");
      })
      .catch(() => {
        setLoggedIn(false);
      });
  }, []);

  const handleHeaderButtonClick = async () => {
    if (loggedIn) {
      try {
        await axios.get(`${baseUrl}/api/auth/logout`, {
          withCredentials: true,
        });
        setLoggedIn(false);
        navigate("/");
      } catch (error) {
        console.error("Logout failed", error);
      }
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} onClick={handleHeaderButtonClick} />
      <main className="flex-1 flex items-center justify-center">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
