import React, { type ReactNode } from "react";
import { Box, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { getColor } from "../../utils/helper";

export interface ITabsSchema {
  label: string;
  component: ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  schema: ITabsSchema[];
  value: string;
  setValue: (value: any) => void;
  fullWidth?: boolean;
}

const useStyles = createUseStyles({
  wrapper: (c: any) => ({
    background: `linear-gradient(180deg, ${c.neutral50}, #ffffff)`,
    borderRadius: 14,
    padding: 14,
    border: `1px solid ${c.neutral200}`,
    boxShadow: `0 10px 24px rgba(0,0,0,0.06)`,
  }),

  tabListRoot: {
    minHeight: "auto !important",
  },

  tabRow: {
    display: "flex !important",
    gap: 12,
    position: "relative",
    flexWrap: "wrap",
  },

  tabBase: (c: any) => ({
    textTransform: "none !important",
    fontSize: 14,
    fontWeight: 500,
    borderRadius: 10,
    padding: "10px 18px !important",
    minHeight: "unset !important",
    color: c.neutral700,
    background: c.neutral50,
    border: `1px solid ${c.neutral200}`,
    transition: "all 0.25s ease",

    "&:hover": {
      background: `linear-gradient(180deg, ${c.secondary50}, ${c.neutral50})`,
      color: c.neutral900,
      borderColor: c.secondary200,
      transform: "translateY(-1px)",
    },

    "&.Mui-selected": {
      background: `linear-gradient(180deg, ${c.secondary200}, ${c.secondary400})`,
      color: c.neutral900,
      borderColor: c.secondary400,
      boxShadow: `0 6px 16px rgba(0,0,0,0.12)`,
      fontWeight: 600,
    },

    "&.Mui-disabled": {
      opacity: 0.35,
      background: c.neutral200,
    },
  }),

  indicator: {
    display: "none",
  },

  panel: (c: any) => ({
    marginTop: 18,
    padding: 20,
    background: `linear-gradient(180deg, #ffffff, ${c.neutral50})`,
    borderRadius: 14,
    border: `1px solid ${c.neutral200}`,
    boxShadow: `0 8px 22px rgba(0,0,0,0.08)`,
  }),
});

const Tabs: React.FC<TabsProps> = ({
  schema,
  value,
  setValue,
  fullWidth = true,
}) => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary300: getColor(defaultTheme, "primary300") || "#10b981",
    neutral50: getColor(defaultTheme, "neutral50") || "#FAFAFA",
    neutral200: getColor(defaultTheme, "neutral200") || "#eeeeee",
    neutral400: getColor(defaultTheme, "neutral400") || "#aaaaaa",
    neutral700: getColor(defaultTheme, "neutral700") || "#555",
    neutral900: getColor(defaultTheme, "neutral900") || "#222",
    secondary50: getColor(defaultTheme, "secondary50") || "#FFFDE7",
    secondary200: getColor(defaultTheme, "secondary200") || "#FFECB3",
    secondary400: getColor(defaultTheme, "secondary400") || "#FFC107",
  };

  const classes = useStyles(colors);

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    setValue(parseInt(newValue));
  };

  return (
    <Box className={`${classes.wrapper} ${fullWidth ? "w-full" : "w-max"}`}>
      <TabContext value={value}>
        <TabList
          onChange={handleChange}
          className={classes.tabListRoot}
          TabIndicatorProps={{ className: classes.indicator }}
        >
          <div className={classes.tabRow}>
            {schema.map((tab, index) => (
              <Tab
                key={index}
                label={tab.label}
                value={(index + 1).toString()}
                disabled={tab.disabled}
                className={classes.tabBase}
              />
            ))}
          </div>
        </TabList>

        {schema.map((tab, index) => (
          <TabPanel
            key={index}
            value={(index + 1).toString()}
            className={classes.panel}
          >
            {tab.component}
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  );
};

export default Tabs;
