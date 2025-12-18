import React from "react";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor } from "../../../utils/helper";
import { FiMail, FiPhone, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { makeRoute } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";

const UserProfileTemplate: React.FC = () => {
    const { user, defaultTheme } = useAuthenticatedUser();
    const navigate = useNavigate();

    if (!user) return <div className="text-sm text-gray-500">No user loaded.</div>;

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
    };

    const initial = user.name?.charAt(0)?.toUpperCase() || "U";

    /* -------------------- Glass Card -------------------- */
    const GlassCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <div
            className="rounded-3xl border shadow-xl p-10 backdrop-blur-3xl transition-all hover:shadow-2xl"
            style={{
                background: "rgba(255,255,255,0.75)",
                borderColor: `${c.neutral200}60`,
                boxShadow: `0 8px 30px ${c.primary50}`,
            }}
        >
            {children}
        </div>
    );

    /* -------------------- Avatar -------------------- */
    const Avatar = () => (
        <div className="relative">
            <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-5xl font-extrabold relative"
                style={{
                    background: `linear-gradient(135deg, ${c.primary50}, ${c.neutral200})`,
                    boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
                }}
            >
                {/* Outer shimmer ring */}
                <div
                    className="absolute inset-0 rounded-full p-[3px]"
                    style={{
                        background: `linear-gradient(140deg, ${c.primary200}, ${c.primary500})`,
                        WebkitMask: "radial-gradient(circle, transparent 62%, black 63%)",
                    }}
                />
                <span style={{ color: c.primary700 }}>{initial}</span>
            </div>

            {/* Online indicator */}
            <span
                className="absolute bottom-2 right-3 w-5 h-5 rounded-full border-4 animate-pulse"
                style={{
                    background: "#4ade80",
                    borderColor: c.neutral0,
                }}
            />
        </div>
    );

    /* -------------------- Action Button -------------------- */
    const ActionButton = ({
        label,
        filled,
        onClick,
    }: {
        label: string;
        filled?: boolean;
        onClick?: () => void;
    }) => (
        <button
            onClick={onClick}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                filled
                    ? "text-white shadow-lg hover:shadow-xl"
                    : "border shadow-sm hover:bg-neutral-50"
            }`}
            style={{
                background: filled
                    ? `linear-gradient(135deg, ${c.primary500}, ${c.primary700})`
                    : "transparent",
                borderColor: filled ? "transparent" : c.neutral200,
                color: filled ? "#fff" : c.neutral800,
            }}
        >
            {label}
        </button>
    );

    /* -------------------- Detail Row -------------------- */
    const DetailRow = ({
        icon,
        label,
        value,
    }: {
        icon: React.ReactNode;
        label: string;
        value: string;
    }) => (
        <div
            className="group flex items-start gap-4 p-4 rounded-xl border transition-all hover:bg-neutral-50 hover:shadow-md hover:-translate-y-0.5"
            style={{
                borderColor: c.neutral200,
                background: c.neutral0,
            }}
        >
            <div
                className="text-xl p-2 rounded-lg"
                style={{
                    color: c.primary700,
                    background: `${c.primary50}90`,
                }}
            >
                {icon}
            </div>

            <div>
                <p className="text-xs uppercase font-semibold" style={{ color: c.neutral600 }}>
                    {label}
                </p>
                <p className="text-sm font-medium mt-1" style={{ color: c.neutral800 }}>
                    {value}
                </p>
            </div>
        </div>
    );

    /* -------------------- Premium Badge -------------------- */
    const Badge = ({ label }: { label: string }) => (
        <span
            className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{
                background: `linear-gradient(135deg, ${c.neutral50}, ${c.primary50})`,
                color: c.primary700,
                border: `1px solid ${c.neutral200}`,
                boxShadow: `0 2px 5px ${c.primary50}`,
            }}
        >
            {label}
        </span>
    );

    /* -------------------- Template Output -------------------- */

    return (
        <div className="w-full max-w-5xl mx-auto space-y-14 pb-24">

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

            {/* Glass Profile Card */}
            <GlassCard>
                <div className="flex flex-col justify-between gap-10">

                    <div className="flex items-center gap-10">
                        <Avatar />

                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight" style={{ color: c.neutral800 }}>
                                {user.name}
                            </h1>
                            <Badge label={user.role || "User"} />
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-xl">
                        <DetailRow icon={<FiMail />} label="Email" value={user.email} />
                        <DetailRow icon={<FiPhone />} label="Phone" value={user.phone} />
                        <DetailRow icon={<FiUser />} label="Role" value={user.role || "User"} />
                    </div>
                </div>
            </GlassCard>

            {/* Actions */}
            <div className="flex justify-end gap-4">
                <ActionButton filled label="Edit Profile" onClick={() => navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE_EDIT, {}))} />
                <ActionButton label="Change Password" />
            </div>
        </div>
    );
};

export default UserProfileTemplate;
