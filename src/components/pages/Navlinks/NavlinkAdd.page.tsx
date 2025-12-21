import React from 'react';
import { useNavlinkService, type NavlinkRequest } from '../../../services/useNavlinkService';
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import NavlinkFormTemplate from '../../templates/Navlinks/NavlinkForm.template';
import { MODE, ADMIN_ROUTES } from '../../../utils/constant';
import { useSnackbar } from '../../../hooks/useSnackbar';
import { makeRoute } from '../../../utils/helper';

const NavlinkAddPage: React.FC = () => {
    const navigate = useNavigate();
    const navlinkService = useNavlinkService();
    const { showSnackbar } = useSnackbar();

    const createNavlink = async (values: NavlinkRequest) => {
        try {
            const response = await navlinkService.createNavlink(values);
            if (response?.status === HTTP_STATUS.OK) {
                navigate(makeRoute(ADMIN_ROUTES.NAVLINKS, {}));
                showSnackbar('success', 'Navlink created successfully');
            }
        } catch (error) {
            console.log(error);
            showSnackbar('error', 'Failed to create navlink');
        }
    };

    return (
        <div>
            <NavlinkFormTemplate onSubmit={createNavlink} mode={MODE.ADD} />
        </div>
    );
};

export default NavlinkAddPage;
