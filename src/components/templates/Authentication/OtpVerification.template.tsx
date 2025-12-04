import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";

interface OTPVerificationTemplateProps {
    phoneNumber: string;
    setAuthState: (authState: AUTH_STATE) => void;
}

const OTPVerificationTemplate: React.FC<OTPVerificationTemplateProps> = ({
    phoneNumber,
    setAuthState,
}) => {
    const authService = useAuthService();
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const { setAuthenticatedUser, setDefaultTheme, setThemes, setNavlinks } = useAuthenticatedUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (timer === 0) return;
        const interval = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const handleVerify = async () => {
        if (otp.length < 6) {
            alert("Please enter a valid OTP");
            return;
        }

        try {
            setIsLoading(true);

            const response = await authService.login({
                phoneNumber,
                otp,
            });
            if (response.status === HTTP_STATUS.OK) {
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
                navigate(`/${user.role}Dashboard`);
            }
        } catch (error) {
            console.error("Login failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-8">

            {/* Back Button */}
            <button
                onClick={() => setAuthState(AUTH_STATE.LOGIN_WITH_PHONE)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4"
            >
                <FiArrowLeft className="text-xl" />
                Back
            </button>

            {/* Header */}
            <div className="text-center mb-6 flex flex-col items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                    <FiShield />
                </div>

                <h2 className="text-2xl font-bold tracking-tight">Verify OTP</h2>
                <p className="text-gray-600 mt-1">
                    Enter the OTP sent to{" "}
                    <span className="font-semibold">{phoneNumber}</span>
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center mb-4">
                <input
                    className="
            text-center text-2xl tracking-widest font-semibold
            border border-gray-300 rounded-lg p-3 w-48
            focus:outline-none focus:ring-2 focus:ring-blue-500
          "
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                />
            </div>

            {/* Resend OTP */}
            <div className="flex justify-between text-sm px-1 mb-3">
                {timer > 0 ? (
                    <p className="text-gray-500">Resend OTP in {timer}s</p>
                ) : (
                    <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setTimer(30)}
                    >
                        Resend OTP
                    </button>
                )}
            </div>

            {/* Verify Button */}
            <Button
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                onClick={handleVerify}
                sx={{
                    mt: 1,
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1rem",
                }}
            >
                {isLoading ? "Verifying..." : "Verify OTP"}
            </Button>
        </div>
    );
};

export default OTPVerificationTemplate;
