import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiChevronLeft,
  FiChevronRight,
  FiLogOut,
} from "react-icons/fi";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor } from "../../../utils/helper";

/* -------------------------------------------------
   ROLE-AWARE PATH RESOLVER
   URL FORMAT: /{role}/{route}
-------------------------------------------------- */
const resolveRolePath = (rawPath: string, role?: string): string => {
  if (!rawPath || !role) return "";

  const cleanRole = role.toLowerCase();
  const cleanPath = rawPath.replace(/^\/+|\/+$/g, "");

  // Already starts with role (admin/dashboard)
  if (cleanPath.startsWith(`${cleanRole}/`)) {
    return `/${cleanPath}`;
  }

  // Placeholder based ({role}/dashboard)
  if (cleanPath.includes("{role}")) {
    return `/${cleanPath.replace("{role}", cleanRole)}`;
  }

  // Default (dashboard → /admin/dashboard)
  return `/${cleanRole}/${cleanPath}`;
};

const useStyles = createUseStyles({
  sidebar: (c: any) => ({
    width: c.collapsed ? 72 : 240,
    background: c.neutral0,
    borderRight: `1px solid ${c.neutral200}`,
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 0,
    transition: "width 0.28s ease",
  }),

  logoWrapper: (c: any) => ({
    padding: "0 16px",
    display: "flex",
    alignItems: "center",
    fontWeight: 700,
    fontSize: 20,
    color: c.primary700,
    borderBottom: `1px solid ${c.neutral200}`,
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),

  nav: {
    flex: 1,
    overflowY: "auto",
    padding: "8px 0",
    minHeight: 0,
  },

  menuItem: (c: any) => ({
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 16px",
    fontSize: 14,
    color: c.neutral700,
    textDecoration: "none",
    borderRight: "3px solid transparent",
    transition: "all 0.2s ease",
    margin: "0 8px",

    "&:hover": {
      background: c.primary50,
      color: c.primary700,
      borderRadius: "4px",
    },

    "&.active": {
      background: c.neutral50,
      color: c.neutral700,
      borderRight: `3px solid ${c.neutral600}`,
      fontWeight: 600,
      borderRadius: "4px",
    },
  }),

  icon: {
    fontSize: 18,
    minWidth: 24,
    display: "flex",
    justifyContent: "center",
  },

  menuText: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  footer: (c: any) => ({
    borderTop: `1px solid ${c.neutral200}`,
  }),

  footerBtn: (c: any) => ({
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    color: c.neutral700,

    "&:hover": {
      background: c.neutral50,
      color: c.primary700,
    },
  }),
});

const Sidebar: React.FC<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}> = ({ collapsed, setCollapsed }) => {
  const { user, defaultTheme, navlinks, logout } = useAuthenticatedUser();
  const location = useLocation();
  const navigate = useNavigate();

  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
    neutral0: "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral600: getColor(defaultTheme, "neutral600") ?? "#4B5563",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
  };

  const classes = useStyles({ ...colors, collapsed });

  /* -------- SORT NAVLINKS SAFELY -------- */
  const menuItems = useMemo(() => {
    if (!Array.isArray(navlinks)) return [];
    return [...navlinks].sort(
      (a: any, b: any) => (a.index ?? 999) - (b.index ?? 999)
    );
  }, [navlinks]);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={classes.sidebar}>
      {/* LOGO */}
      <div className={`${classes.logoWrapper} h-21.5`}>
        {collapsed ? "CH" : "CareHive"}
      </div>

      {/* NAVIGATION */}
      <nav className={classes.nav}>
        {menuItems.map((item: any) => {
          if (!item?.path || !user?.role) return null;

          const fullPath = resolveRolePath(item.path, user.role);

          const isActive =
            location.pathname === fullPath ||
            location.pathname.startsWith(`${fullPath}/`);

          return (
            <Link
              key={`${item.name}-${fullPath}`}
              to={fullPath}
              className={`${classes.menuItem} ${isActive ? "active" : ""}`}
              title={collapsed ? item.name : ""}
            >
              <span className={classes.icon}>
                <FiHome />
              </span>

              {!collapsed && (
                <span className={classes.menuText}>{item.name}</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className={classes.footer}>
        <div
          className={classes.footerBtn}
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          {!collapsed && <span>Collapse</span>}
        </div>

        <div className={classes.footerBtn} onClick={handleLogout}>
          <FiLogOut />
          {!collapsed && <span>Logout</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
