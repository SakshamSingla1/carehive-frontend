import { ToggleButton, ToggleButtonGroup, useTheme } from "@mui/material";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const ThemeSwitcher = () => {
    const { setDefaultTheme, themes } = useAuthenticatedUser();
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newTheme: string | null) => {
        if (newTheme !== null) {
            const selectedTheme = themes?.find(t => t.themeName.toLowerCase() === newTheme.toLowerCase());
            if (selectedTheme) {
                setDefaultTheme(selectedTheme);
            }
        }
    };

    if (!themes || themes.length === 0) return null;

    return (
        <ToggleButtonGroup
            value={isDark ? 'dark' : 'light'}
            exclusive
            onChange={handleThemeChange}
            aria-label="theme toggle"
            size="small"
            color="primary"
        >
            <ToggleButton 
                value="light" 
                aria-label="light theme"
                className="flex items-center gap-1"
            >
                <Brightness7Icon fontSize="small" />
                <span className="text-xs">Light</span>
            </ToggleButton>
            <ToggleButton 
                value="dark" 
                aria-label="dark theme"
                className="flex items-center gap-1"
            >
                <Brightness4Icon fontSize="small" />
                <span className="text-xs">Dark</span>
            </ToggleButton>
        </ToggleButtonGroup>
    );
};

export default ThemeSwitcher;