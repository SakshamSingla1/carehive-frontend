import { Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../components/pages/Dashboard/DashboardHome";
import NavlinkRoutes from "./Admin/NavlinkRoutes";
import ColorThemeRoutes from "./Admin/ColorThemeRoutes";
import ProfileRoutes from "./Admin/ProfileRoutes";
import TemplateRoutes from "./Admin/TemplatesRouter";
import ServiceRoutes from "./Admin/ServiceRouter";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="navlinks/*" element={<NavlinkRoutes />} />
            <Route path="color-theme/*" element={<ColorThemeRoutes />} />
            <Route path="user-profile/*" element={<ProfileRoutes />} />
            <Route path="templates/*" element={<TemplateRoutes />} />
            <Route path="service/*" element={<ServiceRoutes />} />
        </Routes>
    );
};

export default AdminRoutes;