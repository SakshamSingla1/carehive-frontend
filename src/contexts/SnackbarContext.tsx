import React, {
  useState,
  type ReactNode,
  type ReactElement,
  useMemo,
  useCallback,
  useRef,
  useEffect,
} from "react";
import {
  FiCheckCircle,
  FiXCircle,
  FiInfo,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

/* =====================
   TYPES
===================== */

type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarState {
  isActive: boolean;
  type: SnackbarType;
  message: string;
}

interface SnackbarContextProps {
  showSnackbar: (
    type: SnackbarType,
    message: string,
    duration?: number
  ) => void;
  hideSnackbar: () => void;
  SnackBarComponent: ReactNode;
}

interface SnackbarProviderProps {
  children: ReactElement;
}

export const SnackbarContext =
  React.createContext<SnackbarContextProps | undefined>(undefined);

/* =====================
   PROVIDER
===================== */

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackBar, setSnackBar] = useState<SnackbarState>({
    isActive: false,
    type: "success",
    message: "",
  });

  const timeoutRef = useRef<number | null>(null);

  /* =====================
     ACTIONS
  ===================== */

  const hideSnackbar = useCallback(() => {
    setSnackBar((prev) => ({
      ...prev,
      isActive: false,
    }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const showSnackbar = useCallback(
    (type: SnackbarType, message: string, duration = 2500) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      setSnackBar({
        isActive: true,
        type,
        message,
      });

      timeoutRef.current = window.setTimeout(() => {
        hideSnackbar();
      }, duration);
    },
    [hideSnackbar]
  );

  /* =====================
     CLEANUP
  ===================== */

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  /* =====================
     UI HELPERS
  ===================== */

  const getStyles = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return {
          bg: "#ECFDF5",
          border: "#22C55E",
          text: "#166534",
          icon: <FiCheckCircle size={22} />,
        };
      case "error":
        return {
          bg: "#FEF2F2",
          border: "#EF4444",
          text: "#7F1D1D",
          icon: <FiXCircle size={22} />,
        };
      case "info":
        return {
          bg: "#EFF6FF",
          border: "#3B82F6",
          text: "#1E3A8A",
          icon: <FiInfo size={22} />,
        };
      case "warning":
        return {
          bg: "#FFFBEB",
          border: "#F59E0B",
          text: "#92400E",
          icon: <FiAlertTriangle size={22} />,
        };
      default:
        return {
          bg: "#F3F4F6",
          border: "#9CA3AF",
          text: "#111827",
          icon: <FiInfo size={22} />,
        };
    }
  };

  /* =====================
     SNACKBAR COMPONENT
  ===================== */

  const SnackBarComponent = useMemo(() => {
    if (!snackBar.isActive || !snackBar.message) return null;

    const styles = getStyles(snackBar.type);

    return (
      <div
        style={{
          position: "fixed",
          top: 72,
          right: 24,
          minWidth: 300,
          maxWidth: 420,
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 16px",
          borderRadius: 12,
          backgroundColor: styles.bg,
          color: styles.text,
          borderLeft: `5px solid ${styles.border}`,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
          zIndex: 10000,
          animation: "slideIn 0.25s ease-out",
        }}
      >
        {/* Icon */}
        <div style={{ color: styles.border }}>{styles.icon}</div>

        {/* Message */}
        <div style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>
          {snackBar.message}
        </div>

        {/* Close */}
        <button
          onClick={hideSnackbar}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: styles.text,
          }}
        >
          <FiX size={18} />
        </button>

        {/* Animation */}
        <style>
          {`
            @keyframes slideIn {
              from {
                opacity: 0;
                transform: translateX(20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
          `}
        </style>
      </div>
    );
  }, [snackBar, hideSnackbar]);

  /* =====================
     PROVIDER VALUE
  ===================== */

  const providerValue = useMemo(
    () => ({
      showSnackbar,
      hideSnackbar,
      SnackBarComponent,
    }),
    [showSnackbar, hideSnackbar, SnackBarComponent]
  );

  return (
    <SnackbarContext.Provider value={providerValue}>
      {children}
      {SnackBarComponent}
    </SnackbarContext.Provider>
  );
};
