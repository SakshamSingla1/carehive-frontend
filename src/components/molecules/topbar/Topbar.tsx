import React from "react";
import { FiBell, FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor, getBreadcrumbsFromUrl } from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";
import { makeRoute } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";

const Topbar: React.FC<{ collapsed: boolean }> = () => {
    const { defaultTheme, user } = useAuthenticatedUser();
    const location = useLocation();
    const navigate = useNavigate();

    const c = {
        primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
        primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
        neutral0: "#FFFFFF",
        neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
        neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
        neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
    };

    const breadcrumbs = getBreadcrumbsFromUrl(location.pathname);
    const breadcrumbText =
        breadcrumbs.map((b) => b.label).join(" / ") || "Dashboard";

    return (
        <div
            className="h-16 sticky top-0 z-40 flex items-center justify-between px-5"
            style={{
                background: c.neutral0,
                borderBottom: `1px solid ${c.neutral200}`,
            }}
        >
            {/* LEFT */}
            <div className="flex items-center gap-4">
                <span
                    className="text-sm font-semibold"
                    style={{ color: c.neutral800 }}
                    title={breadcrumbText}
                >
                    {breadcrumbText}
                </span>

                <div
                    className="hidden md:flex items-center gap-2 rounded-lg px-3 py-2"
                    style={{ background: c.neutral50, color: c.neutral800 }}
                >
                    <FiSearch className="opacity-80" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent focus:outline-none text-sm placeholder-gray-400"
                    />
                </div>
            </div>
            <div className="flex items-center gap-5">
                <FiBell size={20} className="text-gray-700" />
                <button
                    onClick={() => navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE,{}))}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2"
                    style={{
                        background: c.neutral50,
                        color: c.neutral800,
                        boxShadow: `0 1px 2px 0 ${c.neutral200}66`,
                    }}
                    title={user?.name || "User"}
                >
                    <span className="text-sm font-bold">
                        {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Topbar;