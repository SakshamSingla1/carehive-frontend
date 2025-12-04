import React, { type ReactNode } from "react";
import { createUseStyles } from "react-jss";
import OnboardingSection from "./OnboardingSection.template";
import { AUTH_STATE } from "../../../utils/types";

interface AuthenticationTemplateProps {
  children: ReactNode;
  authState: AUTH_STATE;
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
  },
});

const AuthenticationTemplate: React.FC<AuthenticationTemplateProps> = ({
  children,
  authState,
  setAuthState,
}) => {
  const classes = useStyles();

  const onFlip = () => {
    if (window.innerWidth >= 1024) return;
    setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
  };

  const showOnboarding =
    window.innerWidth >= 1024 || authState === AUTH_STATE.LOGIN_WITH_EMAIL;

  return (
    <div className={classes.background}>
      <div className="md:w-9/12 flex h-5/6 mx-auto relative z-10">

        {/* LEFT SIDE — ONBOARDING */}
        {showOnboarding && (
          <div className="w-full flex items-center">
            <OnboardingSection onFlip={onFlip} />
          </div>
        )}

        {/* RIGHT SIDE — AUTH FORM */}
        <div className="w-full bg-white h-full text-textSecondary flex items-center">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthenticationTemplate;
