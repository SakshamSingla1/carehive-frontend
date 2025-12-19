import MuiTextField, { type TextFieldProps } from "@mui/material/TextField";
import { styled } from "@mui/system";
import { createUseStyles } from "react-jss";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";

// Utility to extract color from backend theme
const getColor = (theme: any, name: string) => {
    if (!theme?.palette?.colorGroups) return undefined;

    for (const group of theme.palette.colorGroups) {
        for (const shade of group.colorShades) {
            if (shade.colorName === name) return shade.colorCode;
        }
    }
    return undefined;
};

const useStyles = createUseStyles({
    label: (colors: any) => ({
        color: colors.neutral700,
        fontSize: "16px",
        fontWeight: 400,
        lineHeight: "16px",
    }),

    textField: (colors: any) => ({
        "& .MuiInputBase-root": {
            border: `1px solid ${colors.neutral200}`,
            fontSize: "16px",
            fontWeight: 400,
            borderRadius: "12px",

            "&:hover": {
                borderColor: colors.primary300,
                outline: "none",
            },

            "& .MuiInputBase-input": {
                padding: "13px 12px",
                "&::placeholder": {
                    color: `${colors.neutral900} !important`,
                },
                "&:-webkit-autofill": {
                    WebkitBoxShadow: `0 0 0 1000px inherit inset !important`,
                    WebkitTextFillColor: `${colors.neutral700} !important`,
                    borderRadius: "12px",
                    transition: "background-color 5000s ease-in-out 0s",
                },
            },

            "& .MuiOutlinedInput-notchedOutline": {
                borderWidth: 0,
            },

            "&:focus-within": {
                borderColor: colors.primary300,
                borderWidth: 2,
            },

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderWidth: 0,
            },

            "& .Mui-disabled": {
                color: `${colors.neutral900} !important`,
                borderColor: colors.neutral200,
            },
        },

        "& .Mui-error": {
            border: "1px solid",
            borderColor: colors.secondary200,
            backgroundColor: colors.secondary50,
            color: colors.secondary400,
        },
    }),

    readOnlyInput: (colors: any) => ({
        "& .MuiInputBase-input[readonly]": {
            backgroundColor: colors.neutral50,
            color: `${colors.neutral900} !important`,
        },
    }),

    "@media (max-width: 767px)": {
        textField: (colors: any) => ({
            "& .MuiInputBase-root": {
                border: `1px solid ${colors.neutral200}`,
                fontSize: "14px",
                borderRadius: "6px",

                "& .MuiInputBase-input": {
                    padding: "13px 12px",
                    "&::placeholder": {
                        color: `${colors.neutral400} !important`,
                    },
                },
            },

            "& .Mui-error": {
                borderColor: colors.secondary200,
                borderRadius: "6px",
                backgroundColor: colors.secondary50,
                color: colors.secondary400,
            },
        }),

        label: (colors: any) => ({
            color: colors.neutral700,
            fontSize: "14px",
            lineHeight: "16px",
        }),
    },
});

// -----------------------------
// COMPONENT
// -----------------------------
const TextField = styled((props: TextFieldProps) => {
    const { defaultTheme } = useAuthenticatedUser();

    // Map backend palette → easy variables
    const colors = {
        primary300: getColor(defaultTheme, "primary300") ?? "#10b981",
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

    return (
        <div
            className={`flex flex-col w-auto relative ${
                props.disabled ? "pointer-events-none select-none" : ""
            }`}
        >
            {props.label && <div className={classes.label}>{props.label}</div>}

            <MuiTextField
                {...props}
                label=""
                helperText={null}
                className={`${classes.textField} ${
                    props.InputProps?.readOnly ? classes.readOnlyInput : ""
                }`}
            />

            {props.error && props.helperText && (
                <p className="text-red-500">{props.helperText}</p>
            )}
        </div>
    );
})``;

export default TextField;
