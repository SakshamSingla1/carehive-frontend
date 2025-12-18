import { Route, Routes } from "react-router-dom";
import TemplateListPage from "../../components/pages/Templates/TemplatesListing.page";
import TemplateCreatePage from "../../components/pages/Templates/TemplateCreate.page";
import TemplateEditPage from "../../components/pages/Templates/TemplateEdit.page";
import TemplateViewPage from "../../components/pages/Templates/TemplateView.page";

const TemplateRoutes = () => {
    return (
        <Routes>
            <Route index element={<TemplateListPage />} />
            <Route path="add" element={<TemplateCreatePage />} />
            <Route path=":name/edit" element={<TemplateEditPage />} />
            <Route path=":name" element={<TemplateViewPage />} />
        </Routes>
    );
};

export default TemplateRoutes;