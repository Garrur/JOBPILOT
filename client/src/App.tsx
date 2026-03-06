import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Onboarding from './pages/Onboarding';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public pages — no layout shell */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All app pages require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Route>
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
