import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./components/Landing/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import UserDashboard from "./components/Dashboards/UserDashboard";
import OfficerDashboard from "./components/Dashboards/OfficerDashboard";
import AuditorDashboard from "./components/Dashboards/AuditorDashboard";
import { LanguageProvider } from "./contexts/LanguageContext";

function DashboardRouter() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case "user":
      return <UserDashboard />;
    case "officer":
      return <OfficerDashboard />;
    case "auditor":
      return <AuditorDashboard />;
    default:
      return <UserDashboard />;
  }
}

function AppContent() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage onGetStarted={() => navigate('/login')} />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/dashboard" /> : <Signup />}
      />
      <Route
        path="/dashboard"
        element={<DashboardRouter />}
      />
    </Routes>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;