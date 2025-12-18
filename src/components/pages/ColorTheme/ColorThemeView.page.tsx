import React, { useEffect } from "react";
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import ColorThemeForm from "../../templates/ColorTheme/ColorThemeForm.template";
import { FaPalette } from "react-icons/fa";
import { MODE } from "../../../utils/constant";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";

const ColorThemeView: React.FC = () => {
    const colorThemeService = useColorThemeService();
    const navigate = useNavigate();
    const params = useParams();
    const role = String(params.role);
    const themeName = String(params.themeName);

    const formik = useFormik<ColorTheme>({
        initialValues: {
            role: "",
            themeName: "",
            palette: {
                colorGroups: [
                    { groupName: "", colorShades: [{ colorName: "", colorCode: "#ffffff" }] }
                ]
            }
        },
        enableReinitialize: true, // IMPORTANT for edit mode
        onSubmit: () => {}
    });

    const loadData = async () => {
        try {
            const res = await colorThemeService.getColorThemeByRoleThemeName(role, themeName); // ✅ Load by ID
            formik.setValues({
                role: res.data.data.role,
                themeName: res.data.data.themeName,
                palette:{
                    colorGroups: res.data.data.palette.colorGroups
                }
            });
        } catch (err) {
            console.error("Failed to load color theme:", err);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            {/* Sticky Page Header */}
            <div className="sticky top-0 bg-gray-50 pb-4 z-10">
                <div className="flex items-center gap-3 mb-3">
                    <FaPalette className="text-3xl text-indigo-600 rotate-90" />
                    <h1 className="text-3xl font-semibold">View Color Theme</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    View the theme name, role access, and color palette groups & shades.
                </p>
            </div>

            {/* Main Edit Form Card */}
            <div className="mt-6 bg-white p-6 shadow-md rounded-xl border">

                <ColorThemeForm formik={formik} mode={MODE.VIEW} />

                {/* Validation block */}
                {!formik.isValid && formik.submitCount > 0 && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                        Please correct the highlighted errors before submitting.
                    </div>
                )}
            </div>
            {/* Footer Buttons */}
            <div className="flex justify-end gap-4 mt-8 pt-6">
                <button
                    onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}))}
                    disabled={formik.isSubmitting}
                    className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default ColorThemeView;
