import { Button, Select, MenuItem } from "@mui/material";
import TextField from "../../atoms/TextField";
import {
    type AuthRegisterDTO,
    useAuthService,
} from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { AUTH_STATE } from "../../../utils/types";
import { userNameMaker } from "../../../utils/helper";

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
    const [isLoading, setIsLoading] = useState(false);

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
                }
            } catch (error) {
                console.error("Registration failed:", error);
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
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                        <FiUserPlus />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight">
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
                        error={formik.touched.phoneNumber && !!formik.errors.phoneNumber}
                        helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
                    />

                    <div className="flex flex-col">
                        <label className="text-2xl font-light text-[#555]" htmlFor="role">Role</label>
                        <Select
                            value={formik.values.roleCode || ''}
                            onChange={(e) => formik.setFieldValue('roleCode', e.target.value)}
                        >
                            <MenuItem value="" disabled>
                                {isLoading ? 'Loading roles...' : 'Select Role'}
                            </MenuItem>

                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.enumCode}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </div>

                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        error={formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />

                    {/* Register Button */}
                    <Button
                        fullWidth
                        variant="contained"
                        disabled={isLoading}
                        size="large"
                        onClick={() => formik.handleSubmit()}
                        sx={{
                            mt: 3,
                            mb: 1,
                            py: 1.5,
                            borderRadius: 2,
                            textTransform: "none",
                            fontSize: "1rem",
                        }}
                    >
                        {isLoading ? "Creating account..." : "Create Account"}
                    </Button>

                    {/* Already have account? */}
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <span
                                className="text-blue-600 cursor-pointer font-medium hover:underline"
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
