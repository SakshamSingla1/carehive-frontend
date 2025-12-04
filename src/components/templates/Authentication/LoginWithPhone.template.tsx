import { Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import TextField from "../../atoms/TextField";
import {
  type AuthLoginDTO,
  useAuthService,
} from "../../../services/useAuthService";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { FiLock } from "react-icons/fi";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";

interface LoginWithPhoneProps {
    setPhoneNumber: (phoneNumber: string) => void;
  setAuthState: (authState: AUTH_STATE) => void;
  setIsRegisterFlow: (isRegisterFlow: boolean) => void;
}

/* ---------------------- Validation Schema ---------------------- */
const validationSchema = Yup.object({
  phoneNumber: Yup.string()
    .matches(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number")
    .required("Phone Number is required"),
});

/* ---------------------- Login Component ---------------------- */
const LoginWithPhone: React.FC<LoginWithPhoneProps> = ({ setAuthState, setPhoneNumber, setIsRegisterFlow }) => {
  const authService = useAuthService();
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik<AuthLoginDTO>({
    initialValues: {
      phoneNumber: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);

        const response = await authService.sendOtp(values);
        if (response.status === HTTP_STATUS.OK) {
          setPhoneNumber(String(values.phoneNumber));
          setIsRegisterFlow(false);
          setAuthState(AUTH_STATE.OTP_VERIFICATION);
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
          <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
            <FiLock />
          </div>

          <h2 className="text-2xl font-bold tracking-tight">
            Sign in with Phone
          </h2>

          {/* Toggle Button Group */}
          <div className="mt-6 flex justify-center">
            <ToggleButtonGroup
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

        {/* ------------------ Phone Login Form ------------------ */}
        <div>
          <TextField
            margin="normal"
            fullWidth
            id="phoneNumber"
            name="phoneNumber"
            label="Phone Number"
            value={formik.values.phoneNumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />

          {/* Continue Button */}
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
            {isLoading ? "Sending OTP..." : "Send OTP"}
          </Button>

          {/* Create New Account */}
          <div className="text-center mt-5">
            <p className="text-sm text-gray-600">
              Don’t have an account?{" "}
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

export default LoginWithPhone;
