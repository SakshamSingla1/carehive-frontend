import React, { useState, useEffect } from 'react';
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { HTTP_STATUS } from '../../../utils/types';
import ColorThemeForm from '../../templates/ColorTheme/ColorThemeForm.template';
import { MODE } from '../../../utils/constant';
import { useParams } from 'react-router-dom';

const ColorThemeViewPage: React.FC = () => {
    const colorThemeService = useColorThemeService();
    const params = useParams();
    const role = String(params.role);
    const themeName = String(params.themeName);
    const [colorTheme, setColorTheme] = useState<ColorTheme | null>(null);

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
            <ColorThemeForm onSubmit={() => {}} mode={MODE.VIEW} colorTheme={colorTheme} />
        </div>
    );
};

export default ColorThemeViewPage;
