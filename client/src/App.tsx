import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import OrgsPage from "./pages/orgPage/OrgsPage";
import AssignmentListPage from "./pages/assignmentPage/AssignmentsPage";
import { UserProvider } from "./context/UserProvider";
import SpecificRepositoryPage from "./pages/specificRepositoryPage/SpecificRepositoryPage";
import { GitHubProvider } from "./context/GitHubProvider";
import ReposPage from "./pages/repoPage/ReposPage";
import SpecificUserSubmissionScreen from "./pages/SpecificUserSubmissionScreen";

function App() {
  return (
    <GitHubProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LoginPage />} />
              <Route path="/orgs" element={<OrgsPage />} />
              <Route
                path="/orgs/:orgName/assignments"
                element={<AssignmentListPage />}
              />
              <Route
                path="/orgs/:orgName/assignments/:assignmentName"
                element={<ReposPage />}
              />
              <Route path="/repos" element={<SpecificRepositoryPage />} />
              <Route
                path="/submission/:id"
                element={<SpecificUserSubmissionScreen />}
              />
            </Route>
          </Routes>
        </Router>
      </UserProvider>
    </GitHubProvider>
  );
}

export default App;
