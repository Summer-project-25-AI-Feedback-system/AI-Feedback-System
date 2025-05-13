import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import LoginPage from './pages/loginPage/LoginPage';
import RepositoryListPage from './pages/repositoryListPage/RepositoryListPage';
import SpecificUserSubmissionScreen from './pages/SpecificUserSubmissionScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="/repos" element={<RepositoryListPage />} />
          <Route path="/submission/:id" element={<SpecificUserSubmissionScreen />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App