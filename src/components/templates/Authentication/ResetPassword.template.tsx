import TextField from "../../atoms/TextField";
import { useAuthService, type PasswordResetConfirmDTO } from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import { useSearchParams } from "react-router-dom";
import { InputAdornment, IconButton } from "@mui/material";
import Button from "../../atoms/Button";

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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchParams] = useSearchParams();
  const [showPassword,setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState<boolean>(false);

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
          <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
            <FiLock />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">Reset Password</h2>
          <p className="text-gray-600 mt-1">
            Enter the token sent to your email and set a new password.
          </p>
        </div>

        {/* ------------------ Reset Password Form ------------------ */}
        <div className="flex flex-col gap-y-8">
          <TextField
            fullWidth
            name="newPassword"
            type={showPassword ? "text" : "password"}
            label="New Password"
            value={formik.values.newPassword}
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
            error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
          />

          <TextField
            fullWidth
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
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
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                    size="small"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
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

          {/* Submit */}
          <div className="flex justify-center items-center">
            <Button
              label="Reset Password"
              variant="primaryContained"
              disabled={isLoading}
              onClick={() => formik.handleSubmit()}
            />
          </div>

          {/* Back to Login */}
          <div className="text-center mt-5">
            <p className="text-sm text-gray-600">
              Remember your password?{" "}
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

export default ResetPassword;
