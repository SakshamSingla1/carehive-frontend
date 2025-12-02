import { AuthenticatedUserProvider } from "./contexts/AuthenticatedUserContext";
import ColorThemeListing from "./components/pages/ColorTheme/ColorThemeListing.page";
import ColorThemeCreate from "./components/pages/ColorTheme/ColorThemeCreate.page";
import ColorThemeEdit from "./components/pages/ColorTheme/ColorThemeEdit.page";
import ColorThemeView from "./components/pages/ColorTheme/ColorThemeView.page";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <AuthenticatedUserProvider>
      <Routes>
        <Route path="/color-theme" element={<ColorThemeListing />} />
        <Route path="/color-theme/create" element={<ColorThemeCreate />} />
        <Route path="/color-theme/:role/:themeName/edit" element={<ColorThemeEdit />} />
        <Route path="/color-theme/:role/:themeName" element={<ColorThemeView />} />
      </Routes>
    </AuthenticatedUserProvider>
  );
}

export default App;
