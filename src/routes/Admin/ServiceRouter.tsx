import { Route, Routes } from "react-router-dom";
import ServiceListingPage from "../../components/pages/ServiceManagement/ServiceListing.page";
import ServiceCreatePage from "../../components/pages/ServiceManagement/ServiceCreate.page";
import ServiceEditPage from "../../components/pages/ServiceManagement/ServiceEdit.page";
import ServiceViewPage from "../../components/pages/ServiceManagement/ServiceView.page";

const ServiceRoutes = () => {
    return (
        <Routes>
            <Route index element={<ServiceListingPage />} />
            <Route path="add" element={<ServiceCreatePage />} />
            <Route path=":id/edit" element={<ServiceEditPage />} />
            <Route path=":id" element={<ServiceViewPage />} />
        </Routes>
    );
};

export default ServiceRoutes;