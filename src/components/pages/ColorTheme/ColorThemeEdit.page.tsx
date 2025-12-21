import React, { useState, useEffect } from 'react';
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { useNavigate } from 'react-router-dom';
import { HTTP_STATUS } from '../../../utils/types';
import ColorThemeForm from '../../templates/ColorTheme/ColorThemeForm.template';
import { ADMIN_ROUTES, MODE } from '../../../utils/constant';
import { makeRoute } from '../../../utils/helper';
import { useParams } from 'react-router-dom';
import { useSnackbar } from '../../../hooks/useSnackbar';

const ColorThemeEditPage: React.FC = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbar();
    const params = useParams();
    const role = String(params.role);
    const themeName = String(params.themeName);

    const colorThemeService = useColorThemeService();

    const [colorTheme, setColorTheme] = useState<ColorTheme | null>(null);

    const editColorTheme = async (values: ColorTheme) => {
        try {
            const response = await colorThemeService.updateColorTheme(String(colorTheme?.id), values);
            if (response?.status === HTTP_STATUS.OK) {
                showSnackbar('success', 'Color theme updated successfully');
                navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}));
            }
        } catch (error) {
            showSnackbar('error', 'Failed to update color theme');
            console.error('Error updating color theme:', error);
        }
    }

    const loadColorThemeData = async () => {
        colorThemeService.getColorThemeByRoleThemeName(role, themeName)
            .then((res: any) => {
                if (res.status === HTTP_STATUS.OK) {
                    setColorTheme(res.data.data);
                }
            })
    }

    useEffect(() => {
        loadColorThemeData();
    }, []);

    return (
        <div>
            <ColorThemeForm onSubmit={editColorTheme} mode={MODE.EDIT} colorTheme={colorTheme} />
        </div>
    );
};

export default ColorThemeEditPage;
