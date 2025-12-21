import React, { useMemo, useCallback, useDeferredValue } from "react";
import { FiBell, FiSearch, FiChevronRight } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthenticatedUser } from "../../../hooks/useAuthenticatedUser";
import {
  getColor,
  getBreadcrumbsFromUrl,
  makeRoute,
} from "../../../utils/helper";
import { ADMIN_ROUTES } from "../../../utils/constant";

const Topbar: React.FC<{ collapsed: boolean }> = React.memo(() => {
  const { defaultTheme, user } = useAuthenticatedUser();
  const location = useLocation();
  const navigate = useNavigate();

  /* ---------------- COLORS ---------------- */
  const colors = useMemo(
    () => ({
      primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
      primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
      neutral0: "#FFFFFF",
      neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
      neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
      neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
    }),
    [defaultTheme]
  );

  /* ---------------- BREADCRUMBS ---------------- */
  const rawBreadcrumbs = useMemo(
    () => getBreadcrumbsFromUrl(location.pathname),
    [location.pathname]
  );
  const breadcrumbs = useDeferredValue(rawBreadcrumbs);

  /* ---------------- HANDLERS ---------------- */
  const navigateTo = useCallback(
    (path: string) => navigate(path),
    [navigate]
  );

  const goToProfile = useCallback(
    () => navigate(makeRoute(ADMIN_ROUTES.USER_PROFILE, {})),
    [navigate]
  );

  return (
    <header
      className="
        relative top-0 z-40
        flex items-center
        px-4 sm:px-5
        box-border
        min-h-21.5 max-h-21.5
        overflow-hidden
      "
      style={{
        background: colors.neutral0,
        borderBottom: `1px solid ${colors.neutral200}`,
      }}
    >
      {/* LEFT : Breadcrumbs */}
      <div className="flex items-center gap-2 min-w-0">
        <nav className="flex items-center gap-2 truncate text-sm font-semibold">
          {breadcrumbs.length === 0 && (
            <span style={{ color: colors.neutral800 }}>Dashboard</span>
          )}

          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={crumb.path} className="flex items-center gap-2">
                {index !== 0 && (
                  <FiChevronRight
                    size={14}
                    className="text-gray-400"
                  />
                )}

                {isLast ? (
                  <span
                    className="truncate max-w-40"
                    style={{ color: colors.neutral800 }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <button
                    onClick={() => navigateTo(crumb.path)}
                    className="truncate max-w-40 hover:underline"
                    style={{ color: colors.primary700 }}
                  >
                    {crumb.label}
                  </button>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* CENTER : Search (Perfectly Centered) */}
      <div
        className="
          hidden md:flex
          absolute left-1/2 -translate-x-1/2
          items-center gap-2
          rounded-lg px-3 py-2
          h-12
        "
        style={{
          background: colors.neutral50,
          color: colors.neutral800,
        }}
      >
        <FiSearch className="opacity-70" />
        <input
          type="text"
          placeholder="Search..."
          className="
            bg-transparent focus:outline-none
            text-sm placeholder-gray-400
            w-56
          "
        />
      </div>

      {/* RIGHT : Actions */}
      <div className="ml-auto flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <FiBell size={20} className="text-gray-700" />
        </button>

        <button
          onClick={goToProfile}
          className="
            inline-flex items-center justify-center
            w-10 h-10 rounded-full
            font-bold text-sm
            hover:shadow-md
          "
          style={{
            background: colors.neutral50,
            color: colors.neutral800,
          }}
        >
          {user?.name?.[0]?.toUpperCase() ?? "U"}
        </button>
      </div>
    </header>
  );
});

export default Topbar;
