import React, { useMemo } from "react";
import MuiButton, { type ButtonProps as MuiButtonProps } from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import { getColor } from "../../utils/helper";

type CustomVariant = 
  | "primaryContained" 
  | "secondaryContained" 
  | "tertiaryContained" 
  | "primaryText" 
  | "secondaryText" 
  | "underlined" 
  | "tertiaryText";

type CustomSize = "extraSmall" | "small" | "medium" | "large";

const useStyles = createUseStyles({
  root: {
    minWidth: "auto",
    padding: "0px",
    lineHeight: "1 !important",
    "&:hover": {
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      opacity: 0.6,
    },
  },
  iconButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 28,
    height: 40,
    borderRadius: "45px",
    padding: "8px",
  },
  iconWithText: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
  label: {
    textTransform: "capitalize",
    fontWeight: 500,
  },
  // Size variants
  extraSmall: {
    minHeight: 32,
    padding: "4px 12px",
    fontSize: "14px",
    borderRadius: "4px",
  },
  small: {
    minHeight: 36,
    padding: "6px 16px",
    fontSize: "14px",
    borderRadius: "4px",
  },
  medium: {
    minHeight: 40,
    padding: "8px 20px",
    fontSize: "16px",
    borderRadius: "6px",
  },
  large: {
    minHeight: 48,
    padding: "12px 24px",
    fontSize: "16px",
    borderRadius: "8px",
  },
  // Variant styles
  primaryContained: (colors: any) => ({
    color: colors.neutral50,
    backgroundColor: colors.primary300,
    "&:hover": {
      backgroundColor: `${colors.primary300}E6`, // 90% opacity
    },
    "&:active": {
      backgroundColor: `${colors.primary300}CC`, // 80% opacity
    },
    "&.Mui-disabled": {
      backgroundColor: colors.neutral200,
      color: colors.neutral400,
    },
  }),
  secondaryContained: (colors: any) => ({
    color: colors.primary300,
    backgroundColor: colors.neutral50,
    border: `1px solid ${colors.primary300}`,
    "&:hover": {
      backgroundColor: `${colors.neutral50}E6`,
    },
    "&:active": {
      backgroundColor: `${colors.neutral200}CC`,
    },
    "&.Mui-disabled": {
      borderColor: colors.neutral200,
      color: colors.neutral400,
    },
  }),
  tertiaryContained: (colors: any) => ({
    color: colors.primary300,
    backgroundColor: colors.neutral50,
    border: `1px solid ${colors.neutral200}`,
    "&:hover": {
      backgroundColor: colors.neutral50,
      borderColor: colors.primary300,
    },
    "&.Mui-disabled": {
      color: colors.neutral400,
      borderColor: colors.neutral200,
    },
  }),
  primaryText: (colors: any) => ({
    color: colors.primary300,
    backgroundColor: "transparent",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      color: colors.neutral400,
    },
  }),
  secondaryText: (colors: any) => ({
    color: colors.neutral700,
    backgroundColor: "transparent",
    textDecoration: "none",
    "&:hover": {
      color: colors.primary300,
      textDecoration: "underline",
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      color: colors.neutral400,
    },
  }),
tertiaryText: (colors: any) => ({
  color: colors.neutral700,
  '&:hover': {
    backgroundColor: colors.neutral50,
  }
}),
  underlined: (colors: any) => ({
    color: colors.neutral700,
    backgroundColor: "transparent",
    textDecoration: "underline",
    "&:hover": {
      color: colors.primary300,
      backgroundColor: "transparent",
    },
    "&.Mui-disabled": {
      color: colors.neutral400,
    },
  }),
});

interface ButtonProps extends Omit<MuiButtonProps, "variant" | "size"> {
  variant: CustomVariant;
  label?: string | React.ReactNode;
  isLoading?: boolean;
  iconButton?: React.ReactNode;
  size?: CustomSize;
  buttonWithImg?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primaryContained",
  label,
  isLoading = false,
  iconButton,
  size = "medium",
  buttonWithImg = false,
  className = "",
  disabled = false,
  ...props
}) => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary300: getColor(defaultTheme, "primary300") || "#10b981",
    neutral50: getColor(defaultTheme, "neutral50") || "#FAFAFA",
    neutral200: getColor(defaultTheme, "neutral200") || "#eeeeee",
    neutral400: getColor(defaultTheme, "neutral400") || "#aaaaaa",
    neutral700: getColor(defaultTheme, "neutral700") || "#555",
    neutral900: getColor(defaultTheme, "neutral900") || "#222",
    secondary50: getColor(defaultTheme, "secondary50") || "#FFFDE7",
    secondary200: getColor(defaultTheme, "secondary200") || "#FFECB3",
    secondary400: getColor(defaultTheme, "secondary400") || "#FFC107",
  };

  const styles = useStyles(colors);

  const buttonContent = useMemo(() => {
    if (isLoading) {
      return <CircularProgress size={20} color="inherit" />;
    }

    if (buttonWithImg && (iconButton || label)) {
      return (
        <span className={styles.iconWithText}>
          {iconButton}
          {label && <span>{label}</span>}
        </span>
      );
    }

    return iconButton || label;
  }, [isLoading, buttonWithImg, iconButton, label, styles]);

  return (
    <MuiButton
      variant="text"
      className={`
        ${styles.root} 
        ${styles[variant]} 
        ${styles[size]} 
        ${styles.label} 
        ${className}
      `}
      disabled={disabled || isLoading}
      disableRipple
      disableElevation
      {...props}
    >
      {buttonContent}
    </MuiButton>
  );
};

export default Button;