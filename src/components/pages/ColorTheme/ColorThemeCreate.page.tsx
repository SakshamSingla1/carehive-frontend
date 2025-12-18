import { useColorThemeService, type ColorTheme } from "../../../services/useColorThemeService";
import { useFormik } from "formik";
import * as yup from "yup";
import { HTTP_STATUS } from "../../../utils/types";
import { useNavigate } from "react-router-dom";
import { FaPalette } from "react-icons/fa";
import ColorThemeForm from "../../templates/ColorTheme/ColorThemeForm.template";
import { Button } from "@mui/material";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { MODE } from "../../../utils/constant";

const validationSchema = yup.object({
    role: yup.string().required("Role is required"),
    themeName: yup.string().required("Theme name is required"),
    palette: yup.object({
        colorGroups: yup.array().of(
            yup.object({
                groupName: yup.string().required("Group name required"),
                colorShades: yup.array().of(
                    yup.object({
                        colorName: yup.string().required("Color name required"),
                        colorCode: yup.string().required("Color code required"),
                    })
                ).min(1,"Add at least 1 shade")
            })
        ).min(1,"Add at least 1 group")
    })
});

const ColorThemeCreate = () => {

    const colorThemeService = useColorThemeService();
    const navigate = useNavigate();

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
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                const res = await colorThemeService.createColorTheme(values);
                if (res.status === HTTP_STATUS.OK) navigate("/color-theme");
            } finally {
                setSubmitting(false);
            }
        }
    });

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">

            {/* Page Header */}
            <div className="sticky top-0 bg-gray-50 pb-4 z-10">
                <div className="flex items-center gap-3 mb-3">
                    <FaPalette className="text-3xl text-indigo-600" />
                    <h1 className="text-3xl font-semibold">Create Color Theme</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    Define theme details and build your custom palette with groups & shades.
                </p>
            </div>

            {/* Form Card */}
            <div className="mt-6 bg-white p-6 shadow-md rounded-xl border">
                <ColorThemeForm formik={formik} mode={MODE.ADD} />

                {!formik.isValid && formik.submitCount > 0 && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded text-sm">
                        Please correct the highlighted errors before submitting.
                    </div>
                )}
            </div>
            <div className="flex justify-end gap-4 mt-8">
                    <Button
                        onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}))}
                        className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={formik.submitForm}
                        disabled={formik.isSubmitting}
                        className={`px-5 py-2 rounded-md text-white transition ${
                            formik.isSubmitting
                                ? "bg-gray-400"
                                : "bg-indigo-600 hover:bg-indigo-700"
                        }`}
                    >
                        {formik.isSubmitting ? "Saving..." : "Save Theme"}
                    </Button>
                </div>

        </div>
    );
};

export default ColorThemeCreate;
