import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUsers, FiSettings, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor } from "../../../utils/helper";
import { useNavigate } from "react-router-dom";

const useStyles = createUseStyles({
    sidebar: (c: any) => ({
        width: (props: any) => (props.collapsed ? 72 : 240),
        background: c.neutral0,
        height: "100vh",
        borderRight: `1px solid ${c.neutral200}`,
        transition: "width 0.28s ease",
        display: "flex",
        flexDirection: "column",
        position: "relative",
    }),
    logoWrapper: (c: any) => ({
        padding: "20px",
        fontWeight: 700,
        fontSize: 20,
        color: c.primary700,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    }),
    menuItem: (c: any) => ({
        display: "flex",
        alignItems: "center",
        padding: "12px 16px",
        fontSize: 14,
        color: c.neutral700,
        cursor: "pointer",
        transition: "all 0.2s ease",
        textDecoration: "none",
        "&:hover": {
            background: c.primary50,
            color: c.primary700,
        },
        "&.active": {
            background: c.primary50,
            color: c.primary700,
            borderRight: `3px solid ${c.primary500}`,
        },
    }),
    icon: {
        fontSize: 18,
        marginRight: 12,
        minWidth: 24,
        textAlign: "center",
    },
    collapseBtn: (c: any) => ({
        marginTop: "auto",
        padding: 16,
        cursor: "pointer",
        color: c.neutral700,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        "&:hover": {
            background: c.neutral50,
        },
    }),
    menuText: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
    },
});

const Sidebar: React.FC<{ collapsed: boolean; setCollapsed: (v: boolean) => void }> = ({
    collapsed,
    setCollapsed,
}) => {
    const { defaultTheme, navlinks, logout } = useAuthenticatedUser();
    const location = useLocation();
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    const c = {
        primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
        primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
        primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
        neutral0: "#FFFFFF",
        neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
        neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
        neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
    };

    const classes = useStyles(c);

    // Default menu items if navlinks are not available
    const menuItems = navlinks;

    return (
        <div className={classes.sidebar} style={{ width: collapsed ? 72 : 240 }}>
            <div className={classes.logoWrapper}>
                {collapsed ? "CH" : "CareHive"}
            </div>

            <nav className="flex-1 overflow-y-auto py-4">
                {menuItems?.map((item) => {
                    const fullPath = item.path.startsWith("/admin/")
                        ? item.path
                        : `/admin/${item.path.replace(/^\/+/, "")}`;

                    const isActive =
                        location.pathname === fullPath ||
                        location.pathname.startsWith(`${fullPath}/`);

                    return (
                        <Link
                            key={fullPath}
                            to={fullPath}
                            className={`${classes.menuItem} ${isActive ? 'active' : ''}`}
                            title={item.name}
                        >
                            <span className={classes.icon}>{<FiHome />}</span>
                            {!collapsed && (
                                <span className={classes.menuText}>{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div
                className={classes.collapseBtn}
                onClick={() => setCollapsed(!collapsed)}
            >
                {!collapsed && <span>Collapse</span>}
                {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
            </div>
            <div>
                <button
                    onClick={() => {
                        handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;