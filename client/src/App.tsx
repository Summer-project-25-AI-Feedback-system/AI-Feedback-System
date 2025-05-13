import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import RepositoryListPage from "./pages/repositoryListPage/RepositoryListPage";
import { UserProvider } from "./context/UserProvider";
import SpecificRepositoryPage from './pages/specificRepositoryPage/SpecificRepositoryPage';

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="/repos" element={<RepositoryListPage />} />
            <Route path="/repos/:id" element={<SpecificRepositoryPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
