import React, { useState } from "react";
import { Select as MuiSelect, MenuItem, type SelectProps as MuiSelectProps } from "@mui/material";
import { createUseStyles } from "react-jss";
import { capitalizeFirstLetter, getColor } from "../../utils/helper";
import { FaChevronDown,FaChevronUp } from "react-icons/fa";
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
}

const useStyles = createUseStyles({
  label: (colors: any) => ({
    color: colors.neutral700,
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "18px",
  }),

  input: (colors: any) => ({
    border: `1px solid ${colors.neutral200}`,
    fontSize: "14px",
    fontWeight: 400,
    borderRadius: 4,
    lineHeight: "18px",
    backgroundColor: "white",

    "&:hover": {
      borderColor: colors.primary300,
      borderWidth: 1,
      outline: "none",
    },

    "& .MuiOutlinedInput-notchedOutline": {
      outline: "none",
      borderWidth: 0,
      borderColor: colors.neutral200,
    },

    "& .MuiInputBase-input": {
      lineHeight: "18px",
      padding: "8px 12px",
    },

    "&:focus-within": {
      outline: "none",
      borderColor: `${colors.primary300} !important`,
      borderWidth: "1px !important",
    },

    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      outline: "none",
      borderWidth: 0,
      borderColor: `${colors.neutral200} !important`,
    },

    "& .Mui-disabled": {
      backgroundColor: colors.neutral50,
      fontWeight: 500,
      borderColor: colors.neutral200,
      fontSize: "14px",
      "&:hover": {
        borderColor: colors.neutral200,
        outline: "none",
      },
    },

    // Error state styling similar to TextField
    "& .Mui-error": {
      border: "1px solid",
      borderColor: colors.secondary200,
      backgroundColor: colors.secondary50,
      color: colors.secondary400,
    },
  }),

  placeholder: (colors: any) => ({
    color: `${colors.neutral400} !important`,
    fontWeight: 400,
  }),

  icon: {
    right: 8,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    pointerEvents: "none",
    transition: "transform 0.3s ease",
  },

  iconOpen: {
    transform: "translateY(-50%) rotate(180deg)",
  },
});

const Select: React.FC<SelectProps> = ({
  options,
  label,
  helperText,
  isRequired,
  isCapitalized,
  placeholder,
  ...props
}) => {
  const { defaultTheme } = useAuthenticatedUser();

  // Map backend palette → easy variables (mirrors TextField)
  const colors = {
    primary300: getColor(defaultTheme, "primary300") ?? "#3498db",
    neutral50: getColor(defaultTheme, "neutral50") ?? "#FAFAFA",
    neutral200: getColor(defaultTheme, "neutral200") ?? "#eeeeee",
    neutral400: getColor(defaultTheme, "neutral400") ?? "#aaaaaa",
    neutral700: getColor(defaultTheme, "neutral700") ?? "#555",
    neutral900: getColor(defaultTheme, "neutral900") ?? "#222",

    secondary50: getColor(defaultTheme, "secondary50") ?? "#FFFDE7",
    secondary200: getColor(defaultTheme, "secondary200") ?? "#FFECB3",
    secondary400: getColor(defaultTheme, "secondary400") ?? "#FFC107",
  };

  const classes = useStyles(colors);
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`flex flex-col w-full relative gap-2 ${
        props.disabled ? "pointer-events-none select-none" : ""
      }`}
    >
      {label && (
        <div className={classes.label}>
          {label}
          {isRequired && <span className="text-red-500">*</span>}
        </div>
      )}

      <MuiSelect
        id={`select-${label}`}
        label=""
        {...props}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        className={classes.input}
        IconComponent={(iconProps) => (
          open ? <FaChevronDown
            {...iconProps}
            className={`${classes.icon} ${open ? classes.iconOpen : ""}`}
          /> : <FaChevronUp
            {...iconProps}
            className={`${classes.icon} ${open ? classes.iconOpen : ""}`}
          />
        )}
        displayEmpty
        renderValue={() => {
          const value = props?.value;

          if ((value === undefined || value === null || value === "") && placeholder) {
            return <span className={`${classes.placeholder}`}>{placeholder}</span>;
          }

          if (Array.isArray(value)) {
            // multi-select: join labels
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
      >
        {options?.map((option: Option) => (
          <MenuItem key={option.value} value={option.value} className="capitalize">
            {option.label}
          </MenuItem>
        ))}
      </MuiSelect>

      {props.error === true && <p className="text-red-500">{helperText}</p>}
    </div>
  );
};

export default Select;