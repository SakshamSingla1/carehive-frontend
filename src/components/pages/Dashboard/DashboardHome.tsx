import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import { getColor } from "../../../utils/helper";
import StatCard from "../../molecules/StatCard";
import ActivityFeed from "../../molecules/ActivityFeed";
import GraphCard from "../../molecules/GraphCard";
import TableV2 from "../../atoms/Table";

const DashboardHome = () => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
    primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
    neutral0: "#FFFFFF",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
    neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
  };

  return (
    <div className="grid gap-y-6">

      {/* STATS */}
      <div className="grid grid-cols-3 gap-6">
        <StatCard label="Active Users" value="1,200" colors={colors} />
        <StatCard label="Revenue" value="$24,500" colors={colors} />
        <StatCard label="Requests" value="340" colors={colors} />
      </div>

      {/* CHART + FEED */}
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <GraphCard values={[30, 50, 75, 90, 60, 80]} colors={colors} />
        </div>
        <ActivityFeed
          colors={colors}
          items={[
            "User John created a ticket",
            "Admin updated navlink settings",
            "New role added: Supervisor",
            "Login from new device detected",
          ]}
        />
      </div>

      {/* TABLE PREVIEW */}
      <div className="mt-4">
        <TableV2
          schema={{
            id: "sample",
            title: "Latest Records",
            pagination: {
              total: 10,
              currentPage: 0,
              limit: 5,
              isVisible: false,
            },
            columns: [
              { label: "ID", key: "id", type: "number", props: {} },
              { label: "Name", key: "name", type: "string", props: {} },
              { label: "Status", key: "status", type: "string", props: {} },
            ],
          }}
          records={[
            [1, "Alice", "active"],
            [2, "Bob", "pending"],
            [3, "Charlie", "error"],
          ]}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
