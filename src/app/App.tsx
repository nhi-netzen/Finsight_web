import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { LoginPage } from "./components/LoginPage";
import { DashboardPage } from "./components/DashboardPage";
import { CNNResultsPage } from "./components/CNNResultsPage";
import { FuzzyCNNResultsPage } from "./components/FuzzyCNNResultsPage";
import { AnalysisLoading } from "./components/AnalysisLoading";
import { UserProvider } from "./contexts/UserContext";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [language, setLanguage] = useState<"en" | "vi">("en");

  return (
    <UserProvider>
      <BrowserRouter>
        <div className="min-h-screen" style={{ background: "#0B0B0B", fontFamily: "Inter, sans-serif" }}>
          <Routes>
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage
                    onLogin={() => setIsAuthenticated(true)}
                    language={language}
                    onLanguageChange={setLanguage}
                  />
                )
              }
            />
            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <DashboardPage
                    language={language}
                    onLanguageChange={setLanguage}
                    onLogout={() => setIsAuthenticated(false)}
                  />
                ) : (
                  <Navigate to="/" replace />
                )
              }
            />
            <Route
              path="/analysis/loading"
              element={isAuthenticated ? <AnalysisLoading /> : <Navigate to="/" replace />}
            />
            <Route
              path="/analysis/cnn"
              element={isAuthenticated ? <CNNResultsPage language={language} /> : <Navigate to="/" replace />}
            />
            <Route
              path="/analysis/fuzzy-cnn"
              element={isAuthenticated ? <FuzzyCNNResultsPage language={language} /> : <Navigate to="/" replace />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}