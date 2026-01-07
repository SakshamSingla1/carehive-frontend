import React, { useEffect, useState } from "react";
import { AUTH_STATE, HTTP_STATUS } from "../../../utils/types";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import { useAuthService } from "../../../services/useAuthService";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { useNavigate } from "react-router-dom";
import Button from "../../atoms/Button";
import { useSnackbar } from "../../../hooks/useSnackbar";

interface OTPVerificationTemplateProps {
    phone?: string;
    email?: string;
    setAuthState: (authState: AUTH_STATE) => void;
    isRegisterFlow?: boolean;
    setIsRegisterFlow: (val: boolean) => void;
}

const OTPVerificationTemplate: React.FC<OTPVerificationTemplateProps> = ({
    phone,
    email,
    setAuthState,
    isRegisterFlow = false,
    setIsRegisterFlow,
}) => {
    const authService = useAuthService();
    const navigate = useNavigate();
    const { setAuthenticatedUser, setDefaultTheme, setThemes, setNavlinks } = useAuthenticatedUser();
    const { showSnackbar } = useSnackbar();

    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(30);

    const handleVerify = async () => {
        if (otp.length < 6) {
            showSnackbar('error', 'Please enter a valid 6-digit OTP');
            return;
        }
        try {
            setIsLoading(true);
            let response;
            if (isRegisterFlow) {
                response = await authService.verifyOtp({
                    email: email || "",
                    otp,
                });
                if (response.status === HTTP_STATUS.OK) {
                    setIsRegisterFlow(false);
                    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
                    showSnackbar('success', 'Account verified successfully!');
                    return;
                }
            } else {
                response = await authService.login({
                    phone: phone || "",
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
                        verified: user.verified,
                        caretakerStatus: user.caretakerStatus,
                    });

                    setDefaultTheme(user.defaultTheme);
                    setThemes(user.themes);
                    setNavlinks(user.navLinks);
                    navigate(`/${user.role.toLowerCase()}/dashboard`);
                    showSnackbar('success', 'Login successful!');
                }
            }
        } catch (error) {
            console.error("OTP Verification Failed:", error);
            showSnackbar('error', 'Invalid OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setIsLoading(true);
            if (isRegisterFlow) {
                await authService.resendOtp({ email: email || "" });
            } else {
                await authService.sendOtp({ phone: phone || "" });
            }
            setTimer(30);
        } catch (error) {
            console.error("Failed to resend OTP:", error);
            showSnackbar('error', 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (timer === 0) return;
        const id = setInterval(() => setTimer((t) => t - 1), 1000);
        return () => clearInterval(id);
    }, [timer]);

    return (
        <div className="w-full p-8">
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
            <div className="text-center mb-6 flex flex-col items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 text-3xl flex items-center justify-center mb-3 shadow-sm">
                    <FiShield />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">
                    {isRegisterFlow ? "Verify Your Account" : "Verify OTP"}
                </h2>
                <p className="text-gray-600 mt-1">
                    OTP sent to <span className="font-semibold">{phone || email}</span>
                </p>
            </div>
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
