import { Button } from "@mui/material";
import TextField from "../../atoms/TextField";
import { useAuthService, type PasswordResetConfirmDTO } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import { useSearchParams } from "react-router-dom";

interface ResetPasswordProps {
  setAuthState: (authState: AUTH_STATE) => void;
}

/* ---------------------- Validation Schema ---------------------- */
const validationSchema = Yup.object({
  token: Yup.string().required("Token is required"),

  newPassword: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),

  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

/* ---------------------- Reset Password Component ---------------------- */
const ResetPassword: React.FC<ResetPasswordProps> = ({ setAuthState }) => {
  const authService = useAuthService();
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const formik = useFormik<PasswordResetConfirmDTO>({
    initialValues: {
      token: searchParams.get("token") || "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await authService.resetPassword({
          token: values.token,
          newPassword: values.newPassword,
        });

        if (response.status === HTTP_STATUS.OK) {
          setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
        }
      } catch (error) {
        console.error("Password reset failed:", error);
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

          <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-gray-600 mt-1">
            Enter the token sent to your email and set a new password.
          </p>
        </div>

        {/* ------------------ Reset Password Form ------------------ */}
        <div>
          <TextField
            fullWidth
            margin="normal"
            id="newPassword"
            name="newPassword"
            type="password"
            label="New Password"
            value={formik.values.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />

          <TextField
            fullWidth
            margin="normal"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="Confirm Password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={
              formik.touched.confirmPassword &&
              Boolean(formik.errors.confirmPassword)
            }
            helperText={
              formik.touched.confirmPassword &&
              formik.errors.confirmPassword
            }
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
            {isLoading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
