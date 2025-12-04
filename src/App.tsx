// In App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserContext";
import { useAuthenticatedUser } from "./hooks/useAuthenticatedUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Import all pages
import ColorThemeListing from "./components/pages/ColorTheme/ColorThemeListing.page";
import ColorThemeCreate from "./components/pages/ColorTheme/ColorThemeCreate.page";
import ColorThemeEdit from "./components/pages/ColorTheme/ColorThemeEdit.page";
import ColorThemeView from "./components/pages/ColorTheme/ColorThemeView.page";
import NavlinkListing from "./components/pages/Navlinks/NavlinkListing.page";
import NavlinkAdd from "./components/pages/Navlinks/NavlinkAdd.page";
import NavlinkEdit from "./components/pages/Navlinks/NavlinkEdit.page";
import NavlinkView from "./components/pages/Navlinks/NavlinkView.page";
import Navbar from "./components/molecules/Navbar";
import Authentication from "./components/pages/Authentication/Authentication.page";

// ---------------- PROTECTED ROUTE ----------------
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthenticatedUser();
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return <>{children}</>;
};

// ---------------- LAYOUT WITH NAVBAR ----------------
const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Color Themes */}
          <Route path="/color-theme" element={<ColorThemeListing />} />
          <Route path="/color-theme/create" element={<ColorThemeCreate />} />
          <Route path="/color-theme/:role/:themeName/edit" element={<ColorThemeEdit />} />
          <Route path="/color-theme/:role/:themeName" element={<ColorThemeView />} />

          {/* Navlinks */}
          <Route path="/navlinks" element={<NavlinkListing />} />
          <Route path="/navlinks/add" element={<NavlinkAdd />} />
          <Route path="/navlinks/:role/:index/edit" element={<NavlinkEdit />} />
          <Route path="/navlinks/:role/:index" element={<NavlinkView />} />

          {/* DASHBOARD */}
          <Route
            path="/:roleDashboard"
            element={
              <div className="p-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

// ---------------- MAIN APP ROUTES ----------------
function App() {
  return (
    <AuthenticatedUserProvider>
      <Routes>
        {/* AUTHENTICATION */}
        <Route path="/login" element={<Authentication />} />
        
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* PROTECTED ROUTES */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                404 - Page Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The page you're looking for doesn't exist.
              </p>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Go Back
              </button>
            </div>
          }
        />
      </Routes>
    </AuthenticatedUserProvider>
  );
}

export default App;