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

type SnackbarType = "success" | "error" | "info" | "warning";

interface SnackbarState {
  isActive: boolean;
  type: SnackbarType;
  message: string;
  duration: number;
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

export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({
  children,
}) => {
  const [snackBar, setSnackBar] = useState<SnackbarState>({
    isActive: false,
    type: "success",
    message: "",
    duration: 2500,
  });

  const timeoutRef = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(0);

  const hideSnackbar = useCallback(() => {
    setSnackBar((prev) => ({ ...prev, isActive: false }));

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startTimer = useCallback((duration: number) => {
    startTimeRef.current = Date.now();
    remainingRef.current = duration;

    timeoutRef.current = window.setTimeout(hideSnackbar, duration);

    requestAnimationFrame(() => {
      if (progressRef.current) {
        progressRef.current.style.transition = `width ${duration}ms linear`;
        progressRef.current.style.width = "0%";
      }
    });
  }, [hideSnackbar]);

  const showSnackbar = useCallback(
    (type: SnackbarType, message: string, duration = 2500) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      setSnackBar({
        isActive: true,
        type,
        message,
        duration,
      });

      requestAnimationFrame(() => {
        if (progressRef.current) {
          progressRef.current.style.transition = "none";
          progressRef.current.style.width = "100%";
        }
        startTimer(duration);
      });
    },
    [startTimer]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getStyles = (type: SnackbarType) => {
    switch (type) {
      case "success":
        return {
          bg: "rgba(236,253,245,0.95)",
          border: "rgba(34,197,94,0.3)",
          text: "rgba(6,95,70,0.8)",
          icon: <FiCheckCircle size={22} />,
        };
      case "error":
        return {
          bg: "rgba(254,242,242,0.95)",
          border: "rgba(239,68,68,0.3)",
          text: "rgba(127,29,29,0.8)",
          icon: <FiXCircle size={22} />,
        };
      case "info":
        return {
          bg: "rgba(239,246,255,0.95)",
          border: "rgba(59,130,246,0.3)",
          text: "rgba(30,58,138,0.8)",
          icon: <FiInfo size={22} />,
        };
      case "warning":
        return {
          bg: "rgba(255,251,235,0.95)",
          border: "rgba(245,158,11,0.3)",
          text: "rgba(146,64,14,0.8)",
          icon: <FiAlertTriangle size={22} />,
        };
    }
  };

  const SnackBarComponent = useMemo(() => {
    if (!snackBar.isActive || !snackBar.message) return null;

    const styles = getStyles(snackBar.type);

    return (
      <div className="snackbar-root">
        <div
          className="snackbar-card"
          style={{
            background: styles.bg,
            color: styles.text,
            borderLeft: `5px solid ${styles.border}`,
          }}
          onMouseEnter={() => {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
              remainingRef.current -= Date.now() - startTimeRef.current;
            }
          }}
          onMouseLeave={() => startTimer(remainingRef.current)}
        >
          <div style={{ color: styles.border }}>{styles.icon}</div>
          <div className="snackbar-message">{snackBar.message}</div>
          <button className="snackbar-close" onClick={hideSnackbar}>
            <FiX size={18} />
          </button>
          <div className="snackbar-progress">
            <div
              ref={progressRef}
              className="snackbar-progress-bar"
              style={{ backgroundColor: styles.border }}
            />
          </div>
        </div>

        <style>
          {`
          .snackbar-root {
            position: fixed;
            z-index: 10000;
            top: 72px;
            right: 24px;
          }

          @media (max-width: 640px) {
            .snackbar-root {
              top: auto;
              bottom: 20px;
              right: 50%;
              transform: translateX(50%);
            }
          }

          .snackbar-card {
            min-width: 280px;
            max-width: 420px;
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px 16px;
            border-radius: 14px;
            box-shadow: 0 12px 32px rgba(0,0,0,0.18);
            backdrop-filter: blur(10px);
            animation: snackbar-in 0.35s cubic-bezier(.22,1,.36,1);
            position: relative;
            overflow: hidden;
          }

          .snackbar-message {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.4;
          }

          .snackbar-close {
            border: none;
            background: transparent;
            cursor: pointer;
            opacity: 0.7;
          }

          .snackbar-close:hover {
            opacity: 1;
          }

          .snackbar-progress {
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            width: 100%;
            background: rgba(0,0,0,0.08);
          }

          .snackbar-progress-bar {
            height: 100%;
            width: 100%;
          }

          @keyframes snackbar-in {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.96);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        `}
        </style>
      </div>
    );
  }, [snackBar, hideSnackbar, startTimer]);

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
