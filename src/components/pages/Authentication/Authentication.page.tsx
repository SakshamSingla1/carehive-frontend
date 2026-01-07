import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AUTH_STATE } from "../../../utils/types";

import AuthenticationTemplate from "../../templates/Authentication/Authentication.template";
import LoginWithEmailTemplate from "../../templates/Authentication/LoginWithEmail.template";
import LoginWithPhoneTemplate from "../../templates/Authentication/LoginWithPhone.template";
import OtpVerificationTemplate from "../../templates/Authentication/OtpVerification.template";
import ForgotPasswordTemplate from "../../templates/Authentication/ForgotPassword.template";
import ResetPasswordTemplate from "../../templates/Authentication/ResetPassword.template";
import RegistrationTemplate from "../../templates/Authentication/Registration.template";

const Authentication: React.FC = () => {
  const [authState, setAuthState] = useState<AUTH_STATE | null>(null);
  const [searchParams] = useSearchParams();

  const [phone, setPhone] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isRegisterFlow, setIsRegisterFlow] = useState(false);

  useEffect(() => {
    try {
      const token = searchParams.get("token");
      const nextState = token ? AUTH_STATE.RESET_PASSWORD : AUTH_STATE.LOGIN_WITH_EMAIL;
      setAuthState(nextState);
    } catch {
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    }
  }, [searchParams]);

  const renderAuthView = () => {
    switch (authState) {
      case AUTH_STATE.REGISTER:
        return (
          <RegistrationTemplate
            setEmail={setEmail}
            setAuthState={setAuthState}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.LOGIN_WITH_EMAIL:
        return <LoginWithEmailTemplate setAuthState={setAuthState} />;

      case AUTH_STATE.LOGIN_WITH_PHONE:
        return (
          <LoginWithPhoneTemplate
            setPhone={setPhone}
            setAuthState={setAuthState}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.OTP_VERIFICATION:
        return (
          <OtpVerificationTemplate
            phone={phone || ""}
            email={email || ""}
            setAuthState={setAuthState}
            isRegisterFlow={isRegisterFlow}
            setIsRegisterFlow={setIsRegisterFlow}
          />
        );

      case AUTH_STATE.FORGOT_PASSWORD:
        return <ForgotPasswordTemplate setAuthState={setAuthState} />;

      case AUTH_STATE.RESET_PASSWORD:
        return <ResetPasswordTemplate setAuthState={setAuthState} />;

      default:
        return <LoginWithEmailTemplate setAuthState={setAuthState} />;
    }
  };

  return (
    <AuthenticationTemplate setAuthState={setAuthState}>
      {renderAuthView()}
    </AuthenticationTemplate>
  );
};

export default Authentication;
