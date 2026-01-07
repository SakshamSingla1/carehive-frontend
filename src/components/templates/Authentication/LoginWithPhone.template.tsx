import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "../../atoms/TextField";
import {
  type AuthLoginDTO,
  useAuthService,
} from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiLock, FiMail, FiPhone } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import Button from "../../atoms/Button";
import { useState } from "react";
import { InputAdornment } from "@mui/material";
import { useSnackbar } from "../../../hooks/useSnackbar";

interface LoginWithPhoneProps {
  setPhone: (phone: string) => void;
  setAuthState: (authState: AUTH_STATE) => void;
  setIsRegisterFlow: (isRegisterFlow: boolean) => void;
}

const validationSchema = Yup.object({
  phone: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Phone Number is required"),
});

const LoginWithPhone: React.FC<LoginWithPhoneProps> = ({ setAuthState, setPhone, setIsRegisterFlow }) => {
  const authService = useAuthService();
  const { showSnackbar } = useSnackbar();

  const [isLoading,setIsLoading ] = useState<boolean>(false);

  const formik = useFormik<AuthLoginDTO>({
    initialValues: {
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        const response = await authService.sendOtp(values);
        if (response.status === HTTP_STATUS.OK) {
          setPhone(String(values.phone));
          setIsRegisterFlow(false);
          setAuthState(AUTH_STATE.OTP_VERIFICATION);
        }
      } catch(err) {
        console.error(err);
        showSnackbar('error', 'Failed to send OTP. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="w-full">
      <div className="p-8">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
            <FiLock />
          </div>
          <h2 className="text-2xl text-green-800 font-bold tracking-tight">
            Sign in with Phone
          </h2>
          <div className="mt-6 flex justify-center">
            <ToggleButtonGroup
              fullWidth
              exclusive
              value="phone"
              onChange={(_event, value) => {
                if (value === "email") {
                  setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
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
        <div className="flex flex-col gap-y-8">
          <TextField
            fullWidth
            name="phone"
            label="Phone Number"
            value={formik.values.phone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <div className="flex items-center gap-4">
                    <FiPhone className="text-gray-400" /> +91
                  </div>
                </InputAdornment>
              ),
            }}
            error={formik.touched.phone && Boolean(formik.errors.phone)}
            helperText={formik.touched.phone && formik.errors.phone}
          />
          <div className="flex justify-center items-center">
            <Button
              variant="primaryContained"
              size="large"
              onClick={() => formik.handleSubmit()}
              label="Send OTP"
              disabled={isLoading || !formik.values.phone}
            />
          </div>
          <div className="text-center mt-5">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
              <span
                className=" cursor-pointer text-green-600 font-medium hover:underline"
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

export default LoginWithPhone;
