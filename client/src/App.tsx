import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import LoginPage from "./pages/loginPage/LoginPage";
import OrgsPage from "./pages/orgPage/OrgsPage";
import AssignmentsPage from "./pages/assignmentPage/AssignmentsPage";
import { UserProvider } from "./context/UserProvider";
import RepoDetailPage from "./pages/repoDetailPage/RepoDetailPage";
import { GitHubProvider } from "./context/GitHubProvider";
import ReposPage from "./pages/repoPage/ReposPage";
import SpecificUserSubmissionScreen from "./pages/SpecificUserSubmissionScreen";
import AnalyticsPage from "./pages/analyticsPage/AnalyticsPage";
import PromptEditor from "./components/PromptEditor";
import { SupabaseProvider } from "./context/supabase/SupabaseProvider";

function App() {
  return (
    <SupabaseProvider>
      <GitHubProvider>
        <UserProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/prompt" element={<PromptEditor />} />

              {/* dedicated routes */}
              <Route element={<MainLayout />}>
                <Route index element={<LoginPage />} />
                <Route path="orgs">
                  <Route index element={<OrgsPage />} />
                  <Route path=":orgName">
                    <Route path="assignments" element={<AssignmentsPage />} />
                    <Route path="assignments/:assignmentName">
                      <Route path="repos" element={<ReposPage />} />
                      <Route
                        path="repos/:repoId"
                        element={<RepoDetailPage />}
                      />
                      <Route
                        path="submission"
                        element={<SpecificUserSubmissionScreen />}
                      />
                    </Route>
                    <Route path="analytics" element={<AnalyticsPage />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </UserProvider>
      </GitHubProvider>
    </SupabaseProvider>
  );
}

export default App;
