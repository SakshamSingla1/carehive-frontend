import { Route, Routes } from "react-router-dom";
import NavlinkListPage from "../../components/pages/Navlinks/NavlinkListing.page";
import NavlinkAddPage from "../../components/pages/Navlinks/NavlinkAdd.page";
import NavlinkEditPage from "../../components/pages/Navlinks/NavlinkEdit.page";
import NavlinkViewPage from "../../components/pages/Navlinks/NavlinkView.page";

const NavlinkRoutes = () => {
    return (
        <Routes>
            <Route index element={<NavlinkListPage />} />
            <Route path="add" element={<NavlinkAddPage />} />
            <Route path=":role/:index/edit" element={<NavlinkEditPage />} />
            <Route path=":role/:index" element={<NavlinkViewPage />} />
        </Routes>
    );
};

export default NavlinkRoutes;