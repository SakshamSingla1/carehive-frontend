import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiX, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { InputAdornment, IconButton } from "@mui/material";
import { useAuthService, type ChangePasswordDTO } from "../../services/useAuthService";
import { HTTP_STATUS } from "../../utils/types";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { useSnackbar } from "../../hooks/useSnackbar";

interface ChangePasswordPopupProps {
    open: boolean;
    onClose: () => void;
}

const validationSchema = Yup.object({
    oldPassword: Yup.string().required("Current password is required"),
    newPassword: Yup.string()
        .min(8, "Minimum 8 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], "Passwords do not match")
        .required("Confirm password is required"),
});

const ChangePasswordPopup: React.FC<ChangePasswordPopupProps> = ({
    open,
    onClose,
}) => {
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();

    const [showPassword, setShowPassword] = useState({
        oldPassword: false,
        newPassword: false,
        confirmPassword: false,
    });

    const formik = useFormik<ChangePasswordDTO>({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await authService.changePassword(values);
                if (response.status === HTTP_STATUS.OK) {
                    showSnackbar("success", "Password changed successfully");
                    formik.resetForm();
                    onClose();
                }
            } catch (error) {
                console.error("Change password failed:", error);
                showSnackbar("error", "Failed to change password");
            }
        },
    });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative z-10 w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiLock />
                        Change Password
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100"
                    >
                        <FiX />
                    </button>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                    <TextField
                        fullWidth
                        name="oldPassword"
                        type={showPassword.oldPassword ? "text" : "password"}
                        label="Current Password"
                        value={formik.values.oldPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword((p) => ({
                                                ...p,
                                                oldPassword: !p.oldPassword,
                                            }))
                                        }
                                        size="small"
                                    >
                                        {showPassword.oldPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.oldPassword && Boolean(formik.errors.oldPassword)}
                        helperText={formik.touched.oldPassword && formik.errors.oldPassword}
                    />

                    <TextField
                        fullWidth
                        name="newPassword"
                        type={showPassword.newPassword ? "text" : "password"}
                        label="New Password"
                        value={formik.values.newPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword((p) => ({
                                                ...p,
                                                newPassword: !p.newPassword,
                                            }))
                                        }
                                        size="small"
                                    >
                                        {showPassword.newPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
                        helperText={formik.touched.newPassword && formik.errors.newPassword}
                    />

                    <TextField
                        fullWidth
                        name="confirmPassword"
                        type={showPassword.confirmPassword ? "text" : "password"}
                        label="Confirm Password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowPassword((p) => ({
                                                ...p,
                                                confirmPassword: !p.confirmPassword,
                                            }))
                                        }
                                        size="small"
                                    >
                                        {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                        error={
                            formik.touched.confirmPassword &&
                            Boolean(formik.errors.confirmPassword)
                        }
                        helperText={
                            formik.touched.confirmPassword &&
                            formik.errors.confirmPassword
                        }
                    />
                    <div className="flex justify-between gap-3 pt-4">
                        <Button
                            label="Cancel"
                            variant="tertiaryContained"
                            onClick={onClose}
                        />
                        <Button
                            label="Update Password"
                            variant="primaryContained"
                            onClick={() => formik.handleSubmit()}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPopup;
