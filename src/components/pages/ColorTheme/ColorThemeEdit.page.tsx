import React, { useEffect, useState } from "react";
import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { useFormik } from "formik";
import * as yup from "yup";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate, useParams } from "react-router-dom";
import ColorThemeForm from "../../templates/ColorTheme/ColorThemeForm.template";
import { FaPalette } from "react-icons/fa";

const validationSchema = yup.object({
    role: yup.string().required("Role is required"),
    themeName: yup.string().required("Theme name is required"),
    palette: yup.object({
        colorGroups: yup.array().of(
            yup.object({
                groupName: yup.string().required("Group name required"),
                colorShades: yup.array()
                    .of(
                        yup.object({
                            colorName: yup.string().required("Color name required"),
                            colorCode: yup.string().required("Color code required"),
                        })
                    )
                    .min(1, "Add at least 1 shade"),
            })
        ).min(1, "Add at least 1 group"),
    }),
});

const ColorThemeEdit: React.FC = () => {
    const colorThemeService = useColorThemeService();
    const navigate = useNavigate();
    const params = useParams();
    const role = String(params.role);
    const themeName = String(params.themeName);
    const [theme, setTheme] = useState<ColorTheme | null>(null);

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
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await colorThemeService.updateColorTheme(theme?.id || "", values); // ✅ Correct update
                if (res.status === HTTP_STATUS.OK) {
                    navigate("/color-theme");
                }
            } catch (err) {
                console.error("Failed to update:", err);
            } finally {
                setSubmitting(false);
            }
        }
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
            setTheme(res.data.data);
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
                    <h1 className="text-3xl font-semibold">Edit Color Theme</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    Update the theme name, role access, and color palette groups & shades.
                </p>
            </div>

            {/* Main Edit Form Card */}
            <div className="mt-6 bg-white p-6 shadow-md rounded-xl border">

                <ColorThemeForm formik={formik} mode="edit" />

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
                    onClick={() => navigate("/color-theme")}
                    disabled={formik.isSubmitting}
                    className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                >
                    Cancel
                </button>

                <button
                    onClick={formik.submitForm}
                    disabled={formik.isSubmitting}
                    className={`px-5 py-2 rounded-md text-white transition ${formik.isSubmitting
                            ? "bg-gray-400"
                            : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                >
                    {formik.isSubmitting ? "Updating..." : "Update Theme"}
                </button>
            </div>
        </div>
    );
};

export default ColorThemeEdit;
