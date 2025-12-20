export type MakeRouteParams = {
    params?: { [key: string]: any } | null;
    query?: { [key: string]: any } | null;
};

export interface IPagination {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalRecords: number;
};

export const HTTP_STATUS = {
    OK: 200,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    SERVER_ERROR: 500
}

export const SORT_ENUM = {
   NAME_ASC: "name_asc",
   NAME_DESC: "name_desc",
   CREATED_AT_ASC: "created_at_asc",
   CREATED_AT_DESC: "created_at_desc"
}

export const AUTH_STATE = {
    LOGIN_WITH_EMAIL: "login-with-email",
    LOGIN_WITH_PHONE: "login-with-phone",
    REGISTER: "register",
    FORGOT_PASSWORD: "forgot-password",
    RESET_PASSWORD: "reset-password",
    OTP_VERIFICATION: "otp-verification"
} as const;

export type AUTH_STATE = typeof AUTH_STATE[keyof typeof AUTH_STATE];

export const VERIFICATION_STATUS = {
    PENDING: "PENDING",
    VERIFIED: "VERIFIED",
    REJECTED: "REJECTED"
} as const;

export type VERIFICATION_STATUS = typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS];