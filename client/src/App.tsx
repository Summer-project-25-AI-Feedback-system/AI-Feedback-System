import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import OrgPage from "./pages/orgPage/OrgPage";
import RepositoryListPage from "./pages/repositoryListPage/RepositoryListPage";
import { UserProvider } from "./context/UserProvider";
import SpecificRepositoryPage from "./pages/specificRepositoryPage/SpecificRepositoryPage";
import { GitHubProvider } from "./context/GitHubProvider";

function App() {
  return (
    <GitHubProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LoginPage />} />
              <Route path="/orgs" element={<OrgPage />} />
              <Route
                path="/orgs/:orgLogin/repos"
                element={<RepositoryListPage />}
              />
            </Route>
            <Route path="/repos/:id" element={<SpecificRepositoryPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </GitHubProvider>
  );
}

export default App;
