import { Route, Routes } from "react-router-dom";
import ColorThemeListingPage from "../../components/pages/ColorTheme/ColorThemeListing.page";
import ColorThemeAddPage from "../../components/pages/ColorTheme/ColorThemeCreate.page";
import ColorThemeEditPage from "../../components/pages/ColorTheme/ColorThemeEdit.page";
import ColorThemeViewPage from "../../components/pages/ColorTheme/ColorThemeView.page";

const ColorThemeRoutes = () => {
    return (
        <Routes>
            <Route index element={<ColorThemeListingPage />} />
            <Route path="add" element={<ColorThemeAddPage />} />
            <Route path=":role/:themeName/edit" element={<ColorThemeEditPage />} />
            <Route path=":role/:themeName" element={<ColorThemeViewPage />} />
        </Routes>
    );
};

export default ColorThemeRoutes;