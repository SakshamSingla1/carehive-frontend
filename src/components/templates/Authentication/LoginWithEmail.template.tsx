import { ToggleButton, ToggleButtonGroup } from "@mui/material";
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
import { FiEye, FiLock, FiMail, FiEyeOff, FiPhone } from "react-icons/fi";
import { AUTH_STATE } from "../../../utils/types";
import { InputAdornment } from "@mui/material";
import { IconButton } from "@mui/material";
import Button from "../../atoms/Button";
import { useSnackbar } from "../../../hooks/useSnackbar";

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
    const [showPassword,setShowPassword] = useState<boolean>(false);
    
    const [isLoading,setIsLoading ] = useState<boolean>(false);
    const { showSnackbar } = useSnackbar();


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
                    verified: user.verified,
                    caretakerStatus: user.caretakerStatus,
                });

                setDefaultTheme(user.defaultTheme);
                setThemes(user.themes);
                setNavlinks(user.navLinks);

                navigate(`/${user.role.toLowerCase()}/dashboard`);
                showSnackbar('success', 'Login successful!');
            } catch (error) {
                console.error("Login failed:", error);
                showSnackbar('error', 'Invalid email or password. Please try again.');
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

                    <h2 className="text-2xl text-green-800 font-bold tracking-tight">
                        Sign in to your account
                    </h2>

                    {/* Toggle Button Group */}
                    <div className="mt-6 flex justify-center">
                        <ToggleButtonGroup
                            fullWidth
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
                                borderRadius: "12px",
                                "& .MuiToggleButton-root": {
                                    border: "none",
                                    borderRadius: "8px",
                                    padding: "10px 16px",
                                    fontSize: "0.95rem",
                                    textTransform: "none",
                                    fontWeight: 500,
                                    color: "#4b5563",
                                    "&.Mui-selected": {
                                        backgroundColor: "white",
                                        color: "#10b981",
                                        boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
                                    }
                                },
                            }}
                        >
                            <ToggleButton value="email" className="flex items-center gap-2">
                                <FiMail size={18} /> Email
                            </ToggleButton>
                            <ToggleButton value="phone" className="flex items-center gap-2">
                                <FiPhone size={18} /> Phone
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>

                </div>

                {/* ------------------ Form ------------------ */}
                <div className="space-y-6">
                    <TextField
                        fullWidth
                        id="email"
                        name="email"
                        label="Email Address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FiMail className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />

                    <TextField
                        fullWidth
                        name="password"
                        label="Password"
                        type={showPassword ? "text" : "password"}
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
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                        size="small"
                                    >
                                        {showPassword ? <FiEyeOff /> : <FiEye />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />

                    {/* Forgot Password */}
                    <div className="flex justify-end text-sm mt-1">
                        <button
                            type="button"
                            onClick={() => setAuthState(AUTH_STATE.FORGOT_PASSWORD)}
                            className="text-[#10b981] hover:underline"
                        >
                            Forgot password?
                        </button>
                    </div>

                    {/* Sign In Button */}
                    <div className="flex items-center justify-center">
                        <Button
                            label={"Sign In"}
                            onClick={() => formik.handleSubmit()}
                            variant="primaryContained"
                            className="w-1/2"
                            disabled={isLoading || !formik.isValid}
                        />
                    </div>
                    {/* Create New Account */}
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{" "}
                            <span
                                className="text-[#10b981] cursor-pointer font-medium hover:underline"
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
