import { Routes } from "react-router-dom";

// import ElderDashboardPage from "../components/pages/elder/ElderDashboard.page";
// import BookServicePage from "../components/pages/elder/BookService.page";
// import EmergencyHelpPage from "../components/pages/elder/EmergencyHelp.page";
// import FamilyMemberDashboardPage from "../components/pages/family/FamilyDashboard.page";

const ElderRoutes = () => {
    return (
        <Routes>
        {/* <Route path="/dashboard" element={<ElderDashboardPage />} />
        <Route path="/book-service" element={<BookServicePage />} />
        <Route path="/emergency" element={<EmergencyHelpPage />} />

        {/* Family Member */}
        {/* <Route path="/family/dashboard" element={<FamilyMemberDashboardPage />} /> */}
        </Routes>
    );
};

export default ElderRoutes;
