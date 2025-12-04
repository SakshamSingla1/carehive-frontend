// In Authentication.page.tsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AUTH_STATE } from "../../../utils/types";
import AuthenticationTemplate from "../../templates/Authentication/Authentication.template";
import LoginWithEmailTemplate from "../../templates/Authentication/LoginWithEmail.template";
import LoginWithPhoneTemplate from "../../templates/Authentication/LoginWithPhone.template";
import OtpVerificationTemplate from "../../templates/Authentication/OtpVerification.template";

// Simple loading component
const LoadingScreen = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100%',
  }}>
    <div>Loading authentication...</div>
  </div>
);

const Authentication: React.FC = () => {  
  const [authState, setAuthState] = useState<AUTH_STATE | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    try {
      const token = searchParams.get('token');
      const newState = token ? AUTH_STATE.FORGOT_PASSWORD : AUTH_STATE.LOGIN_WITH_EMAIL;
      setAuthState(newState);
    } catch (error) {
      setAuthState(AUTH_STATE.LOGIN_WITH_EMAIL);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading || !authState) {
    return <LoadingScreen />;
  }

  const renderAuthView = () => {
    switch (authState) {
      case AUTH_STATE.LOGIN_WITH_EMAIL:
        return <LoginWithEmailTemplate setAuthState={setAuthState} />;
      case AUTH_STATE.LOGIN_WITH_PHONE:
        return <LoginWithPhoneTemplate setAuthState={setAuthState} setPhoneNumber={setPhoneNumber} />;
      case AUTH_STATE.OTP_VERIFICATION:
        return <OtpVerificationTemplate setAuthState={setAuthState} phoneNumber={phoneNumber || ""} />;
    //   case AUTH_STATE.FORGOT_PASSWORD:
    //     return <ForgotPasswordTemplate setAuthState={setAuthState} />;
      default:
        return <LoginWithEmailTemplate setAuthState={setAuthState} />;
    }
  };

  return (
    <AuthenticationTemplate authState={authState} setAuthState={setAuthState}>
      {renderAuthView()}
    </AuthenticationTemplate>
  );
};

export default Authentication;