import React, { useState } from "react";
import Sidebar from "../components/molecules/sidebar/Sidebar";
import Topbar from "../components/molecules/topbar/Topbar";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../hooks/useAuthenticatedUser";
import { getColor } from "../utils/helper";

const useStyles = createUseStyles({
  layoutWrapper: (c: any) => ({
    display: "flex",
    height: "100vh",
    background: c.neutral50,
    color: c.neutral800,
  }),
  sidebarWrapper: {
    transition: "width 0.28s ease",
  },
  contentWrapper: (c: any) => ({
    flexGrow: 1,
    background: c.neutral0,
    borderLeft: `1px solid ${c.neutral200}`,
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  }),
  mainContent: {
    flexGrow: 1,
    padding: "24px",
    overflow: "auto",
  },
});

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { defaultTheme } = useAuthenticatedUser();
  const colors = {
    primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
    neutral0: "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
  };

  const classes = useStyles(colors);

  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={classes.layoutWrapper}>
      <div className={classes.sidebarWrapper}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className={classes.contentWrapper}>
        <Topbar collapsed={collapsed} />
        <div className={classes.mainContent}>{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
