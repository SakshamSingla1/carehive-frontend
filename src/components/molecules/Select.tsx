import React, { useState } from "react";
import { Select as MuiSelect, MenuItem, type SelectProps as MuiSelectProps } from "@mui/material";
import { createUseStyles } from "react-jss";
import { capitalizeFirstLetter, getColor } from "../../utils/helper";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";

interface Option {
  value: string | number;
  label: string;
}

interface SelectProps extends Omit<MuiSelectProps, "label"> {
  options: Option[];
  label?: string;
  helperText?: string;
  isRequired?: boolean;
  isCapitalized?: boolean;
  placeholder?: string;
  InputProps?: any;
}

const useStyles = createUseStyles({
  label: (colors: any) => ({
    color: colors.neutral700,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "16px",
    marginLeft: "8px",
  }),

  input: (colors: any) => ({
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: colors.primary300,
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '2px',
        borderColor: colors.primary300,
      },
      '&.Mui-disabled': {
        backgroundColor: colors.neutral50,
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: colors.neutral200,
        }
      }
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: colors.neutral200,
    },
    '& .MuiSelect-select': {
      padding: '13px 12px',
      fontSize: '16px',
      fontWeight: 400,
    },
  }),

  icon: (colors: any) => ({
    right: 8,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    transition: "transform 0.3s ease",
    color: colors.neutral400,
  }),

  menuPaper: (colors: any) => ({
    marginTop: '4px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    border: `1px solid ${colors.neutral200}`,
    '& .MuiList-root': {
      padding: '4px',
    },
    '& .MuiMenuItem-root': {
      fontSize: '16px',
      padding: '10px 16px',
      margin: '4px',
      borderRadius: '8px',
      '&:hover': {
        backgroundColor: colors.primary50,
        color: colors.primary300,
      },
      '&.Mui-selected': {
        backgroundColor: `${colors.primary50} !important`,
        color: colors.primary300,
        '&:hover': {
          backgroundColor: `${colors.primary100} !important`,
        }
      }
    }
  }),

  helperText: (colors: any) => ({
    color: colors.secondary400,
    fontSize: '12px',
    marginTop: '4px',
    marginLeft: '12px',
  }),
});

const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  isRequired,
  isCapitalized,
  placeholder,
  InputProps,
  error,
  ...props
}) => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = {
    primary50: getColor(defaultTheme, "primary50") || "#F0FDF4",
    primary100: getColor(defaultTheme, "primary100") || "#DCFCE7",
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

  const classes = useStyles(colors);
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col w-full">
      {label && (
        <div className={classes.label}>
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </div>
      )}

      <MuiSelect
        id={`select-${label}`}
        label=""
        {...props}
        className={`${classes.input} ${props.className || ''}`}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        IconComponent={(iconProps) => (
          open ? (
            <FaChevronUp
              {...iconProps}
              className={classes.icon}
            />
          ) : (
            <FaChevronDown
              {...iconProps}
              className={classes.icon}
            />
          )
        )}
        displayEmpty
        renderValue={(value) => {
          if ((value === undefined || value === null || value === "") && placeholder) {
            return <span className="text-gray-400">{placeholder}</span>;
          }

          if (Array.isArray(value)) {
            const asStrings = value.map(v => String(v));
            const labels = asStrings.map(
              v => options.find(o => String(o.value) === v)?.label ?? v
            );
            return labels.join(", ");
          }

          if (typeof value === "number") {
            const match = options.find(o => o.value === value);
            return match ? String(match.label) : "";
          }

          if (typeof value === "string") {
            const match = options.find(o => String(o.value) === value)?.label;
            if (match) return isCapitalized ? match.toUpperCase() : match;

            return value
              .split("_")
              .map((el: string) => (isCapitalized ? el.toUpperCase() : capitalizeFirstLetter(el)))
              .join(" ");
          }

          return "";
        }}
        MenuProps={{
          classes: { paper: classes.menuPaper },
          anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
          transformOrigin: { vertical: 'top', horizontal: 'left' },
          PaperProps: {
            style: {
              maxHeight: 300,
            }
          }
        }}
        inputProps={{
          ...props.inputProps,
          className: `${props.inputProps?.className || ''} pl-10`,
        }}
        startAdornment={InputProps?.startAdornment}
      >
        {placeholder && (
          <MenuItem value="" disabled>
            {placeholder}
          </MenuItem>
        )}
        {options?.map((option: Option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            className="m-2 hover:bg-primary-50 transition-colors duration-200"
          >
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {error && helperText && (
        <div className={classes.helperText}>
          {helperText}
        </div>
      )}
    </div>
  );
};

export default Select;