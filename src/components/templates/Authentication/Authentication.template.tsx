import React, { useEffect, type ReactNode, useState } from "react";
import { createUseStyles } from "react-jss";
import OnboardingSection from "./OnboardingSection.template";
import { AUTH_STATE } from "../../../utils/types";

interface AuthenticationTemplateProps {
  children: ReactNode;
  setAuthState: (authState: AUTH_STATE) => void;
}

const useStyles = createUseStyles({
  background: {
    background: "linear-gradient(to bottom right, #ebf8ff, #ccfbf1, #d1fae5)",
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
  },
});

const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  children,
  setAuthState,
}) => {
  const classes = useStyles();

  const [isDesktopView, setIsDesktopView] = useState(window.innerWidth >= 1024);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true);

  const onFlip = () => {
    if (!isDesktopView) {
      setIsOnboardingVisible(false);
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showOnboarding = isDesktopView || isOnboardingVisible;

  return (
    <div className={classes.background}>
      <div
        className={`relative z-10 h-full w-full flex md:w-9/12 md:h-5/6 mx-auto 
        ${isDesktopView ? "flex-row" : "flex-col items-center justify-center"}`}
      >
        {/* ================= MOBILE — CARD VIEW ONBOARDING ================= */}
        {!isDesktopView && showOnboarding && (
          <div className="w-full flex justify-center items-center">
            <div className="w-full bg-white rounded-2xl shadow-xl p-6">
              <OnboardingSection onFlip={onFlip} />
            </div>
          </div>
        )}

        {/* ================= DESKTOP — LEFT ONBOARDING COLUMN ================= */}
        {isDesktopView && (
          <div className="w-full flex items-center">
            <OnboardingSection onFlip={onFlip} />
          </div>
        )}

        {/* ================= AUTH FORM ================= */}
        {!(!isDesktopView && showOnboarding) && (
          <div
            className={`
              bg-white text-textSecondary shadow-xl
              ${isDesktopView
                ? "w-full h-full rounded-tr-3xl rounded-br-3xl flex items-center justify-center p-10"
                : "w-full rounded-2xl p-6"
              }
            `}
          >
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticationTemplate;
