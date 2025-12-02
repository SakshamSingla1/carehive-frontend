import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";

export const ThemeSwitcher = () => {
    const { themes, setDefaultTheme } = useAuthenticatedUser();

    return (
        <select
            onChange={(e) => {
                const theme = themes?.find(t => t.id === e.target.value);
                if (theme) setDefaultTheme(theme);
            }}
        >
            {themes?.map((theme) => (
                <option key={theme.id} value={theme.id}>
                    {theme.themeName}
                </option>
            ))}
        </select>
    )
}