// In App.tsx
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserContext";
import { useAuthenticatedUser } from "./hooks/useAuthenticatedUser";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "./layouts/Dashboard.layout";
import AdminRoutes from "./routes/AdminRoutes";
import ElderRoutes from "./routes/ElderRoutes";
import Authentication from "./components/pages/Authentication/Authentication.page";
import { SnackbarProvider } from "./contexts/SnackbarContext";

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
    return <div>Loading...</div>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

// ---------------- MAIN APP ROUTES ----------------
function App() {
  return (
    <SnackbarProvider>
      <AuthenticatedUserProvider>
        <Routes>
          {/* AUTHENTICATION */}
          <Route path="/login" element={<Authentication />} />

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* ADMIN ROUTES */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* ELDER ROUTES */}
          <Route
            path="/elder/*"
            element={
              <ProtectedRoute>
                <ElderRoutes />
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
    </SnackbarProvider>

  );
}

export default App;