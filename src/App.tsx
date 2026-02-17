import { useState } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

import LandingPage from "./components/Landing/LandingPage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

import UserDashboard from "./components/Dashboards/UserDashboard";
import OfficerDashboard from "./components/Dashboards/OfficerDashboard";
import AuditorDashboard from "./components/Dashboards/AuditorDashboard";

function AppContent() {
  const { user } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    // Show Landing Page first
    if (!showAuth) {
      return <LandingPage onGetStarted={() => setShowAuth(true)} />;
    }

    // Then show login/signup
    return showLogin ? (
      <Login onSwitchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSwitchToLogin={() => setShowLogin(true)} />
    );
  }

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

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;