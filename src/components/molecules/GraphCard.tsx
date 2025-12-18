import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  graphWrapper: (c: any) => ({
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${c.neutral200}`,
    background: c.neutral0,
  }),
  bar: (c: any) => ({
    height: 10,
    background: c.primary500,
    borderRadius: 6,
    marginBottom: 8,
    transition: "width 0.4s ease",
  }),
});

const GraphCard: React.FC<{ values: number[]; colors: any }> = ({ values, colors }) => {
  const classes = useStyles(colors);
  return (
    <div className={classes.graphWrapper}>
      <h3 className="text-lg font-semibold mb-3">Monthly Growth</h3>
      {values.map((v, i) => (
        <div key={i} className={classes.bar} style={{ width: v + "%" }} />
      ))}
    </div>
  );
};

export default GraphCard;
