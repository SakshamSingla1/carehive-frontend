import React, { useEffect, useState } from "react";
import TextField from "../../atoms/TextField";
import ColorPickerField from "../../atoms/ColorPicker";
import { type ColorTheme } from "../../../services/useColorThemeService";
import { type RoleResponse, useRoleService } from "../../../services/useRoleService";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { ADMIN_ROUTES, MODE } from "../../../utils/constant";
import { useFormik } from "formik";
import * as Yup from "yup";
import Button from "../../atoms/Button";
import Select from "../../molecules/Select";
import { useNavigate } from "react-router-dom";
import { makeRoute, capitalizeFirstLetter } from "../../../utils/helper";

interface ColorThemeFormProps {
  onSubmit: (values: ColorTheme) => void;
  mode: string;
  colorTheme?: ColorTheme | null;
}

const validationSchema = Yup.object({
  role: Yup.string().required("Role is required"),
  themeName: Yup.string().required("Theme name is required"),
  palette: Yup.object({
    colorGroups: Yup.array()
      .of(
        Yup.object({
          groupName: Yup.string().required("Group name required"),
          colorShades: Yup.array()
            .of(
              Yup.object({
                colorName: Yup.string().required("Color name required"),
                colorCode: Yup.string().required("Color code required"),
              })
            )
            .min(1, "Add at least 1 shade"),
        })
      )
      .min(1, "Add at least 1 group"),
  }),
});

const ColorThemeForm: React.FC<ColorThemeFormProps> = ({
  onSubmit,
  mode,
  colorTheme,
}) => {
  const roleService = useRoleService();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<RoleResponse[]>([]);

  const formik = useFormik<ColorTheme>({
    initialValues: {
      role: "",
      themeName: "",
      palette: {
        colorGroups: [
          { groupName: "", colorShades: [{ colorName: "", colorCode: "#ffffff" }] },
        ],
      },
    },
    validationSchema,
    onSubmit,
  });

  useEffect(() => {
    roleService.getRoles().then((res) => setRoles(res.data.data));
  }, []);

  useEffect(() => {
    if (colorTheme) formik.setValues(colorTheme);
  }, [colorTheme]);

  const addGroup = () => {
    formik.setFieldValue("palette.colorGroups", [
      ...formik.values.palette.colorGroups,
      { groupName: "", colorShades: [{ colorName: "", colorCode: "#ffffff" }] },
    ]);
  };

  const addShade = (groupIndex: number) => {
    const groups = [...formik.values.palette.colorGroups];
    groups[groupIndex].colorShades.push({ colorName: "", colorCode: "#ffffff" });
    formik.setFieldValue("palette.colorGroups", groups);
  };

  const removeShade = (groupIndex: number, shadeIndex: number) => {
    const groups = [...formik.values.palette.colorGroups];
    groups[groupIndex].colorShades.splice(shadeIndex, 1);
    formik.setFieldValue("palette.colorGroups", groups);
  };

  const removeGroup = (groupIndex: number) => {
    formik.setFieldValue(
      "palette.colorGroups",
      formik.values.palette.colorGroups.filter((_, i) => i !== groupIndex)
    );
  };

  return (
    <div className="w-full mx-auto px-3 sm:px-6 space-y-8 sm:space-y-10 pb-20">

      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-gray-900">
          {capitalizeFirstLetter(mode)} Color Theme Configuration
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
          Define reusable color palettes for consistent UI across the platform
        </p>
      </div>

      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <TextField
            label="Theme Name"
            {...formik.getFieldProps("themeName")}
            error={Boolean(formik.touched.themeName && formik.errors.themeName)}
            helperText={formik.touched.themeName ? formik.errors.themeName : ""}
            disabled={mode === MODE.VIEW}
            fullWidth
          />

          <Select
            label="Role"
            options={roles.map((r) => ({ value: r.enumCode, label: r.name }))}
            value={formik.values.role}
            onChange={(e) => formik.setFieldValue("role", e.target.value)}
            disabled={mode === MODE.VIEW}
            error={Boolean(formik.touched.role && formik.errors.role)}
            helperText={formik.touched.role ? formik.errors.role : ""}
          />
        </div>
      </div>

      {/* Color Groups */}
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800">
            Color Groups
          </h2>

          {mode !== MODE.VIEW && (
            <Button
              label="Add Color Group"
              variant="primaryContained"
              startIcon={<FiPlus />}
              className="w-full sm:w-auto"
              onClick={addGroup}
            />
          )}
        </div>

        {formik.values.palette.colorGroups.map((group, gIndex) => (
          <div
            key={gIndex}
            className="
              bg-white rounded-2xl border border-gray-200
              shadow-sm p-4 sm:p-6
              space-y-4 sm:space-y-6
              transition-shadow hover:shadow-md
            "
          >
            {/* Group Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <TextField
                label="Group Name"
                value={group.groupName}
                onChange={(e) =>
                  formik.setFieldValue(
                    `palette.colorGroups.${gIndex}.groupName`,
                    e.target.value
                  )
                }
                disabled={mode === MODE.VIEW}
                fullWidth
              />

              {mode !== MODE.VIEW && (
                <button
                  onClick={() => removeGroup(gIndex)}
                  className="
                    p-2.5 rounded-lg border border-red-200
                    text-red-600 hover:bg-red-50
                    hover:border-red-300 transition
                  "
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Shades */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-sm font-medium text-gray-700">
                  Color Shades
                </h3>

                {mode !== MODE.VIEW && (
                  <Button
                    label="Add Shade"
                    variant="secondaryContained"
                    startIcon={<FiPlus size={14} />}
                    className="w-full sm:w-auto"
                    onClick={() => addShade(gIndex)}
                  />
                )}
              </div>

              {group.colorShades.map((shade, sIndex) => (
                <div
                  key={sIndex}
                  className="
                    grid grid-cols-1 md:grid-cols-3
                    gap-3 sm:gap-4
                    bg-gray-50 p-3 sm:p-4
                    rounded-xl border border-gray-200
                    transition hover:bg-gray-100
                  "
                >
                  <TextField
                    label="Color Name"
                    value={shade.colorName}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorName`,
                        e.target.value
                      )
                    }
                    disabled={mode === MODE.VIEW}
                    fullWidth
                  />

                  <ColorPickerField
                    label="Color Code"
                    value={shade.colorCode}
                    onChange={(color) =>
                      formik.setFieldValue(
                        `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorCode`,
                        color
                      )
                    }
                    showInput
                    disabled={mode === MODE.VIEW}
                  />

                  {mode !== MODE.VIEW && (
                    <div className="flex items-start justify-end">
                      <button
                        onClick={() => removeShade(gIndex, sIndex)}
                        className="
                          p-2.5 rounded-lg border border-red-200
                          text-red-600 hover:bg-red-50
                          hover:border-red-300 transition
                        "
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="
        w-full mx-auto
        px-3 sm:px-6 py-4
        flex flex-col-reverse sm:flex-row
        justify-between gap-3
      ">
        <Button
          variant="secondaryContained"
          label="Cancel"
          className="w-full sm:w-auto"
          onClick={() => navigate(makeRoute(ADMIN_ROUTES.COLOR_THEME, {}))}
        />

        {mode !== MODE.VIEW && <Button
          variant="primaryContained"
          label={mode === MODE.EDIT ? "Update Color Theme" : "Create Color Theme"}
          className="w-full sm:w-auto"
          onClick={() => formik.handleSubmit()}
          disabled={formik.isSubmitting}
        />}
      </div>
    </div>
  );
};

export default ColorThemeForm;
