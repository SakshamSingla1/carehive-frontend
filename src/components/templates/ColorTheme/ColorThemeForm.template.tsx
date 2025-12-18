import React, { useEffect, useState } from "react";
import TextField from "../../atoms/TextField";
import ColorPickerField from "../../atoms/ColorPicker";
import { type FormikProps } from "formik";
import { type ColorTheme } from "../../../services/useColorThemeService";
import { type RoleResponse, useRoleService } from "../../../services/useRoleService";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { MenuItem, Select, Button } from "@mui/material";
import { MODE } from "../../../utils/constant";

interface ColorThemeFormProps {
    formik: FormikProps<ColorTheme>;
    mode: string;
}

const ColorThemeForm: React.FC<ColorThemeFormProps> = ({ formik, mode }) => {
    const roleService = useRoleService();
    const [roles, setRoles] = useState<RoleResponse[]>([]);

    const loadRoles = async () => {
        try {
            const res = await roleService.getRoles();
            setRoles(res.data.data);
        } catch (e) {
            console.error("Error loading roles:", e);
        }
    };

    const addGroup = () => {
        formik.setFieldValue("palette.colorGroups", [
            ...formik.values.palette.colorGroups,
            { groupName: "", colorShades: [{ colorName: "", colorCode: "#ffffff" }] }
        ]);
    };

    const addShade = (groupIndex: number) => {
        const groups = [...formik.values.palette.colorGroups];
        groups[groupIndex].colorShades.push({
            colorName: "",
            colorCode: "#ffffff"
        });
        formik.setFieldValue("palette.colorGroups", groups);
    };

    const removeShade = (groupIndex: number, shadeIndex: number) => {
        const groups = [...formik.values.palette.colorGroups];
        groups[groupIndex].colorShades.splice(shadeIndex, 1);
        formik.setFieldValue("palette.colorGroups", groups);
    };

    const removeGroup = (groupIndex: number) => {
        const updated = formik.values.palette.colorGroups.filter((_, i) => i !== groupIndex);
        formik.setFieldValue("palette.colorGroups", updated);
    };

    useEffect(() => {
        loadRoles();
    }, []);

    return (
        <div className="space-y-8">

            {/* Theme Name */}
            <div>
                <TextField
                    label="Theme Name"
                    {...formik.getFieldProps("themeName")}
                    fullWidth
                    error={Boolean(formik.touched.themeName && formik.errors.themeName)}
                    helperText={formik.touched.themeName ? formik.errors.themeName : ""}
                    disabled={mode === MODE.VIEW}
                />
            </div>

            {/* Role Selection */}
            <div>
                <Select
                    value={formik.values.role || ""}
                    onChange={(e) => formik.setFieldValue("role", e.target.value)}
                    fullWidth
                    displayEmpty
                    className="text-lg"
                    disabled={mode === MODE.VIEW}
                >
                    <MenuItem value="" disabled>Select Role</MenuItem>
                    {roles.map((r) => (
                        <MenuItem key={r.id} value={r.enumCode}>{r.name}</MenuItem>
                    ))}
                </Select>
                {formik.errors.role && formik.touched.role && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.role}</div>
                )}
            </div>

            {/* Add Group */}
            {mode !== MODE.VIEW && <div>
                <Button
                    variant="contained"
                    onClick={addGroup}
                    startIcon={<FiPlus />}
                    className="bg-indigo-600! hover:bg-indigo-700!"
                >
                    Add Color Group
                </Button>
            </div>}

            {/* Color Groups */}
            <div className="space-y-6">
                {formik.values.palette.colorGroups.map((group, gIndex) => (
                    <div key={gIndex} className="p-5 bg-gray-50 border rounded-lg shadow-sm space-y-5">

                        {/* Group Header */}
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <TextField
                                    label="Group Name"
                                    value={group.groupName}
                                    onChange={(e) =>
                                        formik.setFieldValue(
                                            `palette.colorGroups.${gIndex}.groupName`,
                                            e.target.value
                                        )
                                    }
                                    fullWidth
                                    error={Boolean(
                                        formik.touched.palette?.colorGroups?.[gIndex]?.groupName &&
                                        (
                                            typeof formik.errors.palette?.colorGroups?.[gIndex] === 'string' ||
                                            formik.errors.palette?.colorGroups?.[gIndex]?.groupName
                                        )
                                    )}
                                    helperText={
                                        formik.touched.palette?.colorGroups?.[gIndex]?.groupName
                                            ? typeof formik.errors.palette?.colorGroups?.[gIndex] === 'string'
                                                ? formik.errors.palette.colorGroups[gIndex] as string
                                                : formik.errors.palette?.colorGroups?.[gIndex]?.groupName || ''
                                            : ''
                                    }
                                    disabled={mode === MODE.VIEW}
                                />
                            </div>

                            {mode !== MODE.VIEW && <button
                                onClick={() => removeGroup(gIndex)}
                                className="rounded-md border px-3 py-2 text-red-600 hover:bg-red-50 transition"
                            >
                                <FiTrash2 size={17} />
                            </button>}
                        </div>

                        {/* Add Shade */}
                        {mode !== MODE.VIEW && <button
                            onClick={() => addShade(gIndex)}
                            className="text-indigo-600 border border-indigo-300 px-3 py-2 rounded-md 
                                       hover:bg-indigo-50 flex items-center gap-1 text-sm transition"
                        >
                            <FiPlus size={14} /> Add Shade
                        </button>}

                        {/* Shade List */}
                        <div className="space-y-3">
                            {group.colorShades.map((shade, sIndex) => (
                                <div
                                    key={sIndex}
                                    className="bg-white p-4 rounded-lg border flex items-center gap-4"
                                >
                                    <div className="flex-1">
                                        <TextField
                                            label="Color Name"
                                            value={shade.colorName}
                                            onChange={(e) =>
                                                formik.setFieldValue(
                                                    `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorName`,
                                                    e.target.value
                                                )
                                            }
                                            fullWidth
                                            error={Boolean(
                                                formik.touched.palette?.colorGroups?.[gIndex]?.colorShades?.[sIndex]?.colorName &&
                                                (
                                                    typeof (formik.errors.palette?.colorGroups?.[gIndex] as any)?.colorShades?.[sIndex] === 'string' ||
                                                    (formik.errors.palette?.colorGroups?.[gIndex] as any)?.colorShades?.[sIndex]?.colorName
                                                )
                                            )}
                                            helperText={
                                                formik.touched.palette?.colorGroups?.[gIndex]?.colorShades?.[sIndex]?.colorName
                                                    ? typeof (formik.errors.palette?.colorGroups?.[gIndex] as any)?.colorShades?.[sIndex] === 'string'
                                                        ? (formik.errors.palette?.colorGroups?.[gIndex] as any)?.colorShades?.[sIndex] as string
                                                        : (formik.errors.palette?.colorGroups?.[gIndex] as any)?.colorShades?.[sIndex]?.colorName || ''
                                                    : ''
                                            }
                                            disabled={mode === MODE.VIEW}
                                        />
                                    </div>

                                    <div className="w-1/2 flex items-center gap-2">
                                        <ColorPickerField
                                            label="Color Code"
                                            value={shade.colorCode}
                                            onChange={(color) =>
                                                formik.setFieldValue(
                                                    `palette.colorGroups.${gIndex}.colorShades.${sIndex}.colorCode`,
                                                    color
                                                )
                                            }
                                            showInput={true}
                                            disabled={mode === MODE.VIEW}
                                        />
                                    </div>
                                    {mode !== MODE.VIEW && <button
                                        onClick={() => removeShade(gIndex, sIndex)}
                                        className="rounded-md border px-3 py-2 text-red-600 hover:bg-red-50 transition"
                                    >
                                        <FiTrash2 size={17} />
                                    </button>}

                                </div>
                            ))}
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default ColorThemeForm;
