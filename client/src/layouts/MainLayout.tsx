import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // change
    setLoggedIn(!!token);
  }, []);

  const handleHeaderButtonClick = () => {
    if (loggedIn) {
      localStorage.removeItem("authToken");
      setLoggedIn(false);
      navigate("/");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header loggedIn={loggedIn} onClick={handleHeaderButtonClick}/>
       <main className="flex-1 flex items-center justify-center"><Outlet /></main>
      <Footer />
    </div>
  )
}
