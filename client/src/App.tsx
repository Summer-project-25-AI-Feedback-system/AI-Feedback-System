import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import OrgsPage from "./pages/orgPage/OrgsPage";
import AssignmentsPage from "./pages/assignmentPage/AssignmentsPage";
import { UserProvider } from "./context/UserProvider";
import RepoDetailPage from "./pages/repoDetailPage/RepoDetailPage";
import { GitHubProvider } from "./context/GitHubProvider";
import ReposPage from "./pages/repoPage/ReposPage";
import SpecificUserSubmissionScreen from "./pages/SpecificUserSubmissionScreen";
import AnalyticsPage from './pages/analyticsPage/AnalyticsPage';
import PromptEditor from './components/PromptEditor';
import { SupabaseProvider } from "./context/supabase/SupabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      <GitHubProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="/orgs" element={<OrgsPage />} />
                <Route
                  path="/orgs/:orgName/assignments"
                  element={<AssignmentsPage />}
                />
                <Route
                  path="/orgs/:orgName/assignments/:assignmentName/repos"
                  element={<ReposPage />}
                />
                <Route
                  path="/orgs/:orgName/assignments/:assignmentName/repos/:repoId"
                  element={<RepoDetailPage />}
                />
                <Route
                  path="/orgs/:orgName/assignments/:assignmentName/submission"
                  element={<SpecificUserSubmissionScreen />}
                />
                <Route 
                  path="/orgs/:orgName/analytics"
                  element={<AnalyticsPage />}
                />
              </Route>
              <Route path="/prompt" element={<PromptEditor />} />
            </Routes>
          </Router>
        </UserProvider>
      </GitHubProvider>
    </SupabaseProvider>
  );
}

export default App;