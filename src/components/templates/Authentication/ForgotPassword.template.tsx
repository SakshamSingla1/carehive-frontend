import { Button } from "@mui/material";
import TextField from "../../atoms/TextField";
import { useAuthService } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";

interface ForgotPasswordProps {
    setAuthState: (authState: AUTH_STATE) => void;
}

/* ---------------------- Validation Schema ---------------------- */
const validationSchema = Yup.object({
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
});

/* ---------------------- Forgot Password Component ---------------------- */
const ForgotPassword: React.FC<ForgotPasswordProps> = ({ setAuthState }) => {
    const authService = useAuthService();
    const [isLoading, setIsLoading] = useState(false);

    const formik = useFormik<{ email: string }>({
        initialValues: { email: "" },
        validationSchema,
        onSubmit: async (values) => {
            try {
                setIsLoading(true);
                const response = await authService.forgotPassword(values);

                if (response.status === HTTP_STATUS.OK) {
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                }
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
                        <FiLock />
                    </div>

                    <h2 className="text-2xl font-bold tracking-tight">Forgot Password</h2>
                    <p className="text-gray-600 mt-1">
                        Enter your email to receive a password reset link.
                    </p>
                </div>
                {/* ------------------ Forgot Password Form ------------------ */}
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

                    {/* Submit */}
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
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>

                    {/* Back to Login */}
                    <div className="text-center mt-5">
                        <p className="text-sm text-gray-600">
                            Remember your password?{" "}
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

export default ForgotPassword;
