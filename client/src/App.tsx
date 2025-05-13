import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import OrgPage from "./pages/orgPage/OrgPage";
import RepositoryListPage from "./pages/repositoryListPage/RepositoryListPage";
import { UserProvider } from "./context/UserProvider";

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LoginPage />} />
            <Route path="/repos" element={<RepositoryListPage />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
