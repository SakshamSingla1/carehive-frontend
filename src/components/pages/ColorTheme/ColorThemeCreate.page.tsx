import React from 'react';
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import ColorThemeForm from '../../templates/ColorTheme/ColorThemeForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useSnackbar } from '../../../hooks/useSnackbar';

const ColorThemeCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const colorThemeService = useColorThemeService();

    const editColorTheme = async (values: ColorTheme) => {
        try {
            const response = await colorThemeService.createColorTheme(values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Color theme created successfully');
                navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}));
            }
        } catch (error) {
            showSnackbar('error', 'Failed to create color theme');
            console.log(error);
        }
    }

    return (
        <div>
            <ColorThemeForm onSubmit={editColorTheme} mode={MODE.ADD} />
        </div>
    );
};

export default ColorThemeCreatePage;
