import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const COLOR_THEME_URLS = {
    GET_COLOR_THEME: "color-themes",
    GET_COLOR_THEME_BY_ROLE_THEME_NAME: "color-themes/:role/:themeName",
    GET_COLOR_THEME_BY_ROLE: "color-themes/role/:role",
    GET_COLOR_THEME_BY_ID: "color-themes/:id",
}

export interface ColorShade {
    colorName: string;
    colorCode: string;
}

export interface ColorGroup {
    groupName: string;
    colorShades: ColorShade[];
}

export interface ColorPalette {
    colorGroups: ColorGroup[];
}

export interface ColorTheme {
    id?: string;
    role: string;
    themeName: string;
    palette: ColorPalette;
    createdAt?: string | null;
    updatedAt?: string | null;
    updatedBy?: string | null;
}

export const useColorThemeService = () => {
    const getColorTheme = async () => {
        return request(API_METHOD.GET, COLOR_THEME_URLS.GET_COLOR_THEME, null);
    }

    const getColorThemeById = async (id: string) => {
        return request(API_METHOD.GET, replaceUrlParams(COLOR_THEME_URLS.GET_COLOR_THEME_BY_ID, { id }), null);
    }

    const getColorThemeByRoleThemeName = async (role: string, themeName: string) => {
        return request(API_METHOD.GET, replaceUrlParams(COLOR_THEME_URLS.GET_COLOR_THEME_BY_ROLE_THEME_NAME, { role, themeName }), null);
    }

    const getColorThemeByRole = async (role: string) => {
        return request(API_METHOD.GET, replaceUrlParams(COLOR_THEME_URLS.GET_COLOR_THEME_BY_ROLE, { role }), null);
    }

    const createColorTheme = async (colorTheme: ColorTheme) => {
        return request(API_METHOD.POST, COLOR_THEME_URLS.GET_COLOR_THEME, null, colorTheme);
    }

    const updateColorTheme = async (id: string, colorTheme: ColorTheme) => {
        return request(API_METHOD.PUT, replaceUrlParams(COLOR_THEME_URLS.GET_COLOR_THEME_BY_ID, { id }), null, colorTheme);
    }

    const deleteColorTheme = async (id: string) => {
        return request(API_METHOD.DELETE, replaceUrlParams(COLOR_THEME_URLS.GET_COLOR_THEME_BY_ID, { id }), null);
    }

    return {
        getColorTheme,
        getColorThemeById,
        getColorThemeByRoleThemeName,
        getColorThemeByRole,
        createColorTheme,
        updateColorTheme,
        deleteColorTheme
    }
}