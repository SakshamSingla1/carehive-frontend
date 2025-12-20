import React from "react";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor, makeRoute } from "../../../utils/helper";
import {
    FiMail,
    FiPhone,
    FiUser,
    FiShield,
    FiClock,
    FiX,
    FiEdit
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ADMIN_ROUTES, ROLES } from "../../../utils/constant";
import { VERIFICATION_STATUS } from "../../../utils/types";
import Button from "../../atoms/Button";

const UserProfileTemplate: React.FC = () => {
    const { user, defaultTheme } = useAuthenticatedUser();
    const navigate = useNavigate();

    if (!user) {
        return (
            <div className="h-60 flex items-center justify-center text-sm text-gray-500">
                Loading profile…
            </div>
        );
    }

    const c = {
        primary50: getColor(defaultTheme, "primary50") ?? "#edf2ff",
        primary200: getColor(defaultTheme, "primary200") ?? "#b3c0e6",
        primary500: getColor(defaultTheme, "primary500") ?? "#4b5c99",
        primary700: getColor(defaultTheme, "primary700") ?? "#1f2a50",

        neutral0: "#ffffff",
        neutral50: getColor(defaultTheme, "neutral50") ?? "#f8fafc",
        neutral200: getColor(defaultTheme, "neutral200") ?? "#e2e8f0",
        neutral600: getColor(defaultTheme, "neutral600") ?? "#475569",
        neutral800: getColor(defaultTheme, "neutral800") ?? "#1e293b",

        success: "#16a34a",
        warning: "#f59e0b",
        danger: "#dc2626",
    };

    const initial = user.name?.charAt(0)?.toUpperCase() || "U";

    /* -------------------- STATUS PILL -------------------- */
    const StatusPill = ({
        status,
        label,
    }: {
        status?: string;
        label: string;
    }) => {
        if (!status) return null;

        const config = {
            [VERIFICATION_STATUS.VERIFIED]: {
                color: c.success,
                bg: "rgba(22,163,74,0.12)",
                icon: <FiShield />,
            },
            [VERIFICATION_STATUS.PENDING]: {
                color: c.warning,
                bg: "rgba(245,158,11,0.14)",
                icon: <FiClock />,
            },
            [VERIFICATION_STATUS.REJECTED]: {
                color: c.danger,
                bg: "rgba(220,38,38,0.14)",
                icon: <FiX />,
            },
        }[status];

        return (
            <span
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                    background: config?.bg,
                    color: config?.color,
                }}
            >
                {config?.icon}
                {label}
            </span>
        );
    };

    /* -------------------- GLASS CARD -------------------- */
    const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div
            className="relative rounded-4xl border p-10 backdrop-blur-3xl"
            style={{
                background:
                    "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(255,255,255,0.65))",
                borderColor: `${c.neutral200}80`,
                boxShadow: `0 25px 80px -20px ${c.primary200}`,
            }}
        >
            <div
                className="absolute inset-0 rounded-4xl pointer-events-none"
                style={{
                    background: `radial-gradient(circle at top right, ${c.primary200}40, transparent 60%)`,
                }}
            />
            {children}
        </div>
    );

    /* -------------------- AVATAR -------------------- */
    const Avatar = () => (
        <div className="relative">
            <div
                className="w-36 h-36 rounded-full flex items-center justify-center text-6xl font-black"
                style={{
                    background: `linear-gradient(135deg, ${c.primary50}, ${c.neutral200})`,
                    boxShadow: `0 25px 60px -15px ${c.primary500}`,
                }}
            >
                <span style={{ color: c.primary700 }}>{initial}</span>
            </div>

            <span
                className="absolute bottom-3 right-3 w-5 h-5 rounded-full border-4 animate-pulse"
                style={{
                    background: "#22c55e",
                    borderColor: c.neutral0,
                }}
            />
        </div>
    );

    /* -------------------- DETAIL ROW -------------------- */
    const DetailRow = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value?: string;
    }) => (
        <div
            className="flex gap-4 p-4 rounded-xl border"
            style={{
                borderColor: c.neutral200,
                background: c.neutral0,
            }}
        >
            <div
                className="p-3 rounded-lg text-lg"
                style={{
                    background: c.primary50,
                    color: c.primary700,
                }}
            >
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase font-semibold" style={{ color: c.neutral600 }}>
                    {label}
                </p>
                <p className="text-sm font-medium mt-1" style={{ color: c.neutral800 }}>
                    {value || "—"}
                </p>
            </div>
        </div>
    );

    /* -------------------- RENDER -------------------- */
    return (
        <div className="max-w-6xl mx-auto space-y-16 pb-28">
            {/* Header */}
            {/* Header Banner */}
            <div
                className="h-48 w-full rounded-3xl relative overflow-hidden shadow-inner"
                style={{
                    background: `linear-gradient(120deg, ${c.neutral50}, ${c.primary200}40)`,
                }}
            >
                <div
                    className="absolute w-96 h-96 rounded-full blur-3xl opacity-40"
                    style={{
                        background: c.primary200,
                        top: "-5rem",
                        right: "-4rem",
                    }}
                />
            </div>

            <GlassCard>
                <div className="flex flex-col gap-12">
                    <div className="flex flex-col sm:flex-row gap-10 items-start sm:items-center">
                        <Avatar />

                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold" style={{ color: c.neutral800 }}>
                                {user.name}
                            </h1>

                            <div className="flex flex-wrap gap-3">
                                <span
                                    className="px-4 py-1.5 rounded-full text-xs font-semibold"
                                    style={{
                                        background: `linear-gradient(135deg, ${c.primary50}, ${c.primary200})`,
                                        color: c.primary700,
                                    }}
                                >
                                    {user.role || "User"}
                                </span>

                                <StatusPill
                                    status={user.verified}
                                    label={user.verified || "Unverified"}
                                />
                                { user.role === ROLES.CARETAKER && <StatusPill
                                    status={user.caretakerStatus}
                                    label={user.caretakerStatus || "Unverified"}
                                />}
                            </div>
                        </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 max-w-2xl">
                        <DetailRow icon={<FiMail />} label="Email" value={user.email} />
                        <DetailRow icon={<FiPhone />} label="Phone" value={user.phone} />
                        <DetailRow icon={<FiUser />} label="Role" value={user.role} />
                    </div>
                </div>
            </GlassCard>

            <div className="flex justify-end gap-4">
                <Button
                    label={"Edit Profile"}
                    onClick={() =>
                        navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE_EDIT, {}))
                    }
                    variant="primaryContained"
                    startIcon={<FiEdit />}
                />

                <Button
                    label={"Change Password"}
                    variant="secondaryContained"
                />
            </div>
        </div>
    );
};

export default UserProfileTemplate;
