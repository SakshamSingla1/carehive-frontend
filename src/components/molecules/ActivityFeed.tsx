import React from "react";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  feedWrapper: (c: any) => ({
    padding: 20,
    borderRadius: 12,
    border: `1px solid ${c.neutral200}`,
    background: c.neutral0,
  }),
  item: (c: any) => ({
    padding: "10px 0",
    borderBottom: `1px solid ${c.neutral200}`,
    fontSize: 14,
    color: c.neutral800,
  }),
});

const ActivityFeed: React.FC<{ items: string[]; colors: any }> = ({ items, colors }) => {
  const classes = useStyles(colors);
  return (
    <div className={classes.feedWrapper}>
      <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
      {items.map((x, i) => (
        <div key={i} className={classes.item}>
          {x}
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
