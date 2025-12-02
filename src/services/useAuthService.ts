import { request } from "."
import { API_METHOD } from "../utils/constant";
import { replaceUrlParams } from "../utils/helper";

export const AUTH_URLS = {
    REGISTER: "auth/register",
    LOGIN : "auth/login",
    VERIFY_OTP : "auth/verify-otp",
    SEND_OTP : "auth/send-otp",
    RESEND_OTP : "auth/resend-otp",
    FORGOT_PASSWORD : "auth/forgot-password",
    VALIDATE_RESET_TOKEN : "auth/validate-reset-token",
    RESET_PASSWORD : "auth/reset-password",
    CHANGE_PASSWORD : "auth/change-password",
    GET_ME : "auth/me",   
}

export interface AuthRegisterDTO {
    name: string;
    username: string;
    email: string;
    password: string;
    roleCode: string;
    phoneNumber: string;
}

export interface AuthLoginDTO {
    username?: string;
    email?: string;
    phoneNumber?: string;
    otp?: string;
    password?: string;
}

export interface AuthVerifyOtpDTO {
    phone?: string;
    email?: string;
    otp: string;
}

export interface PasswordResetConfirmDTO {
    token: string;
    newPassword: string;
}

export interface ChangePasswordDTO {
    userId: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const useAuthService = () => {
    const login = (data: AuthLoginDTO) => {
        localStorage.setItem("reLoginTimestamp", new Date().toISOString());
        sessionStorage.removeItem("sessionHandled");
        return request(API_METHOD.POST, AUTH_URLS.LOGIN, null, data);
    }

    const register = async (user: AuthRegisterDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.REGISTER, null, user);
    }

    const verifyOtp = async (data: AuthVerifyOtpDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.VERIFY_OTP, null, data);
    }

    const sendOtp = async (data: {email?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.SEND_OTP, null, data);
    }

    const resendOtp = async (data: {phone?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.RESEND_OTP, null, data);
    }

    const forgotPassword = async (data: {email?: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.FORGOT_PASSWORD, null, data);
    }

    const validateResetToken = async (data: {token: string}) => {
        return request(API_METHOD.POST, AUTH_URLS.VALIDATE_RESET_TOKEN, null, data);
    }

    const resetPassword = async (data: PasswordResetConfirmDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.RESET_PASSWORD, null, data);
    }

    const changePassword = async (data: ChangePasswordDTO) => {
        return request(API_METHOD.POST, AUTH_URLS.CHANGE_PASSWORD, null, data);
    }

    const getMe = async () => {
        return request(API_METHOD.GET, AUTH_URLS.GET_ME, null);
    }

    return {
        login,
        register,
        verifyOtp,
        sendOtp,
        resendOtp,
        forgotPassword,
        validateResetToken,
        resetPassword,
        changePassword,
        getMe
    }
}