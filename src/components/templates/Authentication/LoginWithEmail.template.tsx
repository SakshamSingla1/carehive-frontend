import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "../../atoms/TextField";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import {
    type AuthLoginDTO,
    useAuthService,
} from "../../../services/useAuthService";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { AUTH_STATE } from "../../../utils/types";

interface LoginWithEmailProps {
    setAuthState: (authState: AUTH_STATE) => void;
}

/* ---------------------- Validation Schema ---------------------- */
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Please enter a valid email")
        .required("Email is required"),

    password: Yup.string().required("Password is required"),
});

/* ---------------------- Login Component ---------------------- */
const LoginWithEmail: React.FC<LoginWithEmailProps> = ({ setAuthState }) => {
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setThemes, setNavlinks } =
        useAuthenticatedUser();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<AuthLoginDTO>({
        initialValues: {
            email: "",
            password: "",
        },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);

                const response = await authService.login(values);
                const user = response.data.data;

                setAuthenticatedUser({
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,
                    username: user.username,
                    phone: user.phone,
                    token: user.token,
                });

                setDefaultTheme(user.defaultTheme);
                setThemes(user.themes);
                setNavlinks(user.navLinks);

                navigate(`/${user.role}/dashboard`);
            } catch (error) {
                console.error("Login failed:", error);
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
                        <FiLock />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight">
                        Sign in to your account
                    </h2>

                    {/* Toggle Button Group */}
                    <div className="mt-6 flex justify-center">
                        <ToggleButtonGroup
                            exclusive
                            value="email"
                            onChange={(_event, value) => {
                                if (value === "phone") {
                                    setAuthState(AUTH_STATE.LOGIN_WITH_PHONE);
                                }
                            }}
                            sx={{
                                backgroundColor: "#f3f4f6",
                                padding: "4px",
                                borderRadius: "9999px",
                                "& .MuiToggleButton-root": {
                                    border: "none",
                                    borderRadius: "9999px",
                                    padding: "8px 22px",
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    fontWeight: 600,
                                    color: "#4b5563",
                                },
                                "& .Mui-selected": {
                                    backgroundColor: "#10b981 !important",
                                    color: "white !important",
                                    boxShadow: "0 2px 6px rgba(16,185,129,0.5)",
                                },
                            }}
                        >
                            <ToggleButton value="email">Login with Email</ToggleButton>
                            <ToggleButton value="phone">Login with Phone</ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                </div>

                {/* ------------------ Form ------------------ */}
                <div>
                    <TextField
                        margin="normal"
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        margin="normal"
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    {/* Forgot Password */}
                    <div className="flex justify-end text-sm mt-1">
                        <button
                            type="button"
                            onClick={() => setAuthState(AUTH_STATE.FORGOT_PASSWORD)}
                            className="text-blue-600 hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
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
                        {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    {/* Create New Account */}
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                                className="text-blue-600 cursor-pointer font-medium hover:underline"
                                onClick={() => setAuthState(AUTH_STATE.REGISTER)}
                            >
                                Create one
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginWithEmail;
