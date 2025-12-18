import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  card: (c: any) => ({
    padding: 20,
    borderRadius: 12,
    background: c.neutral0,
    border: `1px solid ${c.neutral200}`,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    boxShadow: "0 4px 14px rgba(0,0,0,0.05)",
  }),
  label: (c: any) => ({
    fontSize: 14,
    color: c.neutral700,
  }),
  value: (c: any) => ({
    fontSize: 32,
    fontWeight: 700,
    color: c.primary700,
  }),
});

const StatCard: React.FC<{ label: string; value: string | number; colors: any }> = ({
  label,
  value,
  colors,
}) => {
  const classes = useStyles(colors);
  return (
    <div className={classes.card}>
      <span className={classes.label}>{label}</span>
      <span className={classes.value}>{value}</span>
    </div>
  );
};

export default StatCard;
