import React, { useEffect, useState } from "react";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button";

interface OTPVerificationTemplateProps {
    phoneNumber?: string;
    email?: string;
    setAuthState: (authState: AUTH_STATE) => void;
    isRegisterFlow?: boolean;
    setIsRegisterFlow: (val: boolean) => void;
}

const OTPVerificationTemplate: React.FC<OTPVerificationTemplateProps> = ({
    phoneNumber,
    email,
    setAuthState,
    isRegisterFlow = false,
    setIsRegisterFlow,
}) => {
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setThemes, setNavlinks } = useAuthenticatedUser();

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    /* Countdown Timer */
    useEffect(() => {
        if (timer === 0) return;
        const id = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    /* ---------------------- Handle OTP Verify ---------------------- */
    const handleVerify = async () => {
        if (otp.length < 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setIsLoading(true);

            let response;

            if (isRegisterFlow) {
                // 🔥 Registration → VERIFY ACCOUNT
                response = await authService.verifyOtp({
                    email: email || "",
                    otp,
                });

                if (response.status === HTTP_STATUS.OK) {
                    // After verifying account → go to LOGIN
                    setIsRegisterFlow(false);
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    return;
                }
            } else {
                // 🔥 Login → USE LOGIN API
                response = await authService.login({
                    phoneNumber: phoneNumber || "",
                    otp,
                });

                if (response.status === HTTP_STATUS.OK) {
                    const user = response.data.data;

                    // Store logged-in user
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
                }
            }
        } catch (error) {
            console.error("OTP Verification Failed:", error);
            alert("Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    /* ---------------------- Handle Resend OTP ---------------------- */
    const handleResendOtp = async () => {
        try {
            setIsLoading(true);

            if (isRegisterFlow) {
                // Registration → resend OTP to EMAIL
                await authService.resendOtp({ email: email || "" });
            } else {
                // Login → resend OTP to PHONE
                await authService.sendOtp({ phoneNumber: phoneNumber || "" });
            }

            setTimer(30);
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            alert("Failed to resend OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full p-8">

            {/* Back Button */}
            <button
                onClick={() =>
                    setAuthState(isRegisterFlow ? AUTH_STATE.REGISTER : AUTH_STATE.LOGIN_WITH_PHONE)
                }
                className="flex items-center gap-2 text-green-600 hover:text-green-700 mb-4"
                disabled={isLoading}
            >
                <FiArrowLeft className="text-xl" />
                Back
            </button>

            {/* Header */}
            <div className="text-center mb-6 flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                    <FiShield />
                </div>

                <h2 className="text-2xl font-bold tracking-tight">
                    {isRegisterFlow ? "Verify Your Account" : "Verify OTP"}
                </h2>

                <p className="text-gray-600 mt-1">
                    OTP sent to <span className="font-semibold">{phoneNumber || email}</span>
                </p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center mb-4">
                <input
                    className="
                        text-center text-2xl tracking-widest font-semibold
                        border border-green-300 rounded-lg p-3 w-48
                        focus:outline-none focus:ring-2 focus:ring-green-500
                    "
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="______"
                    disabled={isLoading}
                />
            </div>

            {/* Resend OTP */}
            <div className="flex justify-between text-sm px-1 mb-3">
                {timer > 0 ? (
                    <p className="text-gray-500">Resend OTP in {timer}s</p>
                ) : (
                    <button
                        className="text-green-600 hover:underline disabled:opacity-50"
                        onClick={handleResendOtp}
                        disabled={isLoading}
                    >
                        Resend OTP
                    </button>
                )}
            </div>

            <div className="flex justify-center items-center">
                <Button
                    label="Verify OTP"
                    variant="primaryContained"
                    disabled={isLoading || otp.length < 6}
                    onClick={handleVerify}
                    className="w-1/2"
                />
            </div>
        </div>
    );
};

export default OTPVerificationTemplate;
