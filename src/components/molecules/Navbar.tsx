import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, IconButton, Drawer } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import ThemeSwitcher from "./ThemeSwitcher";

const Navbar: React.FC = () => {
  const { navlinks, logout } = useAuthenticatedUser();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  if (!navlinks || navlinks.length === 0) return null;

  const sortedNav = [...navlinks].sort(
    (a, b) => Number(a.index) - Number(b.index)
  );

  // ✅ Ensure dynamic path always becomes absolute (/path)
  const normalizePath = (path: string) => {
    if (!path) return "/";
    return path.startsWith("/") ? path : `/${path}`;
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-gray-900 tracking-wide">
              YourLogo
            </span>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center ml-10 space-x-8">
              {sortedNav.map((nav) => {
                const absolutePath = normalizePath(nav.path);
                const active = location.pathname === absolutePath;

                return (
                  <Link
                    key={`${nav.roleCode}-${nav.index}`}
                    to={absolutePath}
                    className={`text-sm font-medium pb-1 border-b-2 transition-all ${
                      active
                        ? "border-blue-600 text-blue-700"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    }`}
                  >
                    {nav.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitcher />
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <IconButton onClick={() => setMobileOpen(true)}>
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </div>

      {/* Drawer for Mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        PaperProps={{
          className: "w-72 p-4 bg-white",
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <span className="text-xl font-bold">Menu</span>
          <IconButton onClick={() => setMobileOpen(false)}>
            <CloseIcon />
          </IconButton>
        </div>

        <div className="space-y-3">
          {sortedNav.map((nav) => {
            const absolutePath = normalizePath(nav.path);
            const active = location.pathname === absolutePath;

            return (
              <Link
                key={`mobile-${nav.roleCode}-${nav.index}`}
                to={absolutePath}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-2 rounded-md text-base font-medium transition ${
                  active
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {nav.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t">
            <ThemeSwitcher />
          </div>

          <button
            onClick={() => {
              setMobileOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100 font-medium"
          >
            Logout
          </button>
        </div>
      </Drawer>
    </header>
  );
};

export default Navbar;
