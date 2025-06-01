
import { useAuth } from "@/hooks/useAuth";
import AuthForm from "@/components/AuthForm";
import Dashboard from "@/components/Dashboard";
import LandingPage from "@/components/LandingPage";
import { useState } from "react";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is authenticated, show dashboard
  if (user) {
    return <Dashboard initialSearchQuery={searchQuery} />;
  }

  // If user needs to authenticate after search, show auth form
  if (showAuth) {
    return <AuthForm onBack={() => setShowAuth(false)} />;
  }

  // Default landing page
  return (
    <LandingPage 
      onSearch={(query) => {
        setSearchQuery(query);
        setShowAuth(true);
      }} 
    />
  );
};

export default Index;
