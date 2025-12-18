import { Route, Routes } from "react-router-dom";
import UserProfile from "../../components/pages/Profile/UserProfile.page";
import UserProfileEdit from "../../components/pages/Profile/UserProfileEdit.page";

const ProfileRoutes = () => {
    return (
        <Routes>
            <Route index element={<UserProfile />} />
            <Route path="edit" element={<UserProfileEdit />} />
        </Routes>
    );
};

export default ProfileRoutes;