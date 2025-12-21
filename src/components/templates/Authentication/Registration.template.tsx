import TextField from "../../atoms/TextField";
import {
    type AuthRegisterDTO,
    useAuthService,
} from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiUserPlus } from "react-icons/fi";
import { AUTH_STATE } from "../../../utils/types";
import { userNameMaker } from "../../../utils/helper";
import Select from "../../molecules/Select";
import Button from "../../atoms/Button";
import { useState } from "react";
import { InputAdornment,IconButton } from "@mui/material";
import { FiLock, FiEye, FiEyeOff, FiUser, FiMail, FiPhone, FiBriefcase } from "react-icons/fi";
import { useSnackbar } from "../../../hooks/useSnackbar";

export const roles = [
    { id: 1, enumCode: "ELDER", name: "Elder" },
    { id: 2, enumCode: "CARETAKER", name: "Caretaker" },
];

interface RegisterTemplateProps {
    setEmail: (email: string) => void;
    setAuthState: (authState: AUTH_STATE) => void;
    setIsRegisterFlow: (isRegisterFlow: boolean) => void;
}

/* ---------------------- Validation Schema ---------------------- */
const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().email("Enter a valid email").required("Email is required"),
    phoneNumber: Yup.string().required("Phone number is required"),
    roleCode: Yup.string().required("Role is required"),
    password: Yup.string().min(6).required("Password is required"),
    confirmPassword: Yup.string().required("Confirm Password is required").oneOf([Yup.ref("password")], "Passwords must match"),
});

/* ---------------------- Register Component ---------------------- */
const RegisterTemplate: React.FC<RegisterTemplateProps> = ({ setEmail, setAuthState, setIsRegisterFlow }) => {
    const authService = useAuthService();
    const { showSnackbar } = useSnackbar();

    const [showPassword,setShowPassword] = useState<{password: boolean,confirmPassword: boolean
    }>({password: false, confirmPassword: false});
    const [isLoading,setIsLoading] = useState<boolean>(false);

    const formik = useFormik<AuthRegisterDTO>({
        initialValues: {
            name: "",
            username: "",
            email: "",
            phoneNumber: "",
            roleCode: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.register({
                    ...values,
                    username: userNameMaker(values.email),
                });

                if (response.status === 200) {
                    setEmail(values.email);
                    setIsRegisterFlow(true);
                    setAuthState(AUTH_STATE.OTP_VERIFICATION);
                    showSnackbar('success', 'Registration successful! Please verify your email.');
                }
            } catch (error) {
                console.error("Registration failed:", error);
                showSnackbar('error', 'Registration failed. Please try again.');
            } finally {
                setIsLoading(false);
            }
        },
    });

    return (
        <div className="w-full">
            <div className="p-8">
                {/* ------------------ Header ------------------ */}
                <div className="text-center mb-6 flex flex-col items-center">
                    <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                        <FiUserPlus />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight text-green-800">
                        Create your account
                    </h2>
                </div>

                {/* ------------------ Registration Form ------------------ */}
                <div className="space-y-4">
                    <TextField
                        fullWidth
                        id="name"
                        name="name"
                        label="Full Name"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiUser className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.name && !!formik.errors.name}
                        helperText={formik.touched.name && formik.errors.name}
                    />

                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.email && !!formik.errors.email}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        fullWidth
                        id="phoneNumber"
                        name="phoneNumber"
                        label="Phone Number"
                        value={formik.values.phoneNumber}
                        onChange={formik.handleChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiPhone className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />

                    <div className="flex flex-col">
                        <Select
                            label="Role"
                            options={roles.map(role => ({ value: role.enumCode, label: role.name }))}
                            value={formik.values.roleCode || ''}
                            onChange={(e) => formik.setFieldValue('roleCode', e.target.value)}
                            error={formik.touched.roleCode && !!formik.errors.roleCode}
                            helperText={Boolean(formik.touched.roleCode && formik.errors.roleCode) ? String(formik.errors.roleCode) : undefined}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <FiBriefcase className="text-gray-400" />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <TextField
                        fullWidth
                        name="password"
                        type={showPassword.password ? "text" : "password"}
                        label="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiLock className="text-gray-400" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.password ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
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
                                    <FiLock className="text-gray-400" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword.confirmPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
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

                    {/* Register Button */}
                    <div className="flex justify-center items-center">
                        <Button
                            label="Sign Up"
                            variant="primaryContained"
                            size="large"
                            onClick={() => formik.handleSubmit()}
                            disabled={isLoading}
                        />
                    </div>

                    {/* Already have account? */}
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <span
                                className="text-green-600 cursor-pointer font-medium hover:underline"
                                onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL)}
                            >
                                Sign in
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterTemplate;
