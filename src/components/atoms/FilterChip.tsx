import React, { useState, useMemo } from 'react';
import {
    Select as MuiSelect,
    MenuItem,
    type SelectProps as MuiSelectProps,
    InputAdornment,
    Checkbox,
    ListItemText,
    styled,
    Box
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import { BsArrowLeftRight } from "react-icons/bs";
import { useAuthenticatedUser } from "../../hooks/useAuthenticatedUser";
import TextField from "../atoms/TextField";
import Button from "../atoms/Button";
import { getColor } from "../../utils/helper";

export interface FilterChipOption {
    label: string;
    value: string | number;
}

interface FilterChipV2Props extends Omit<MuiSelectProps, 'onChange' | 'value'> {
    options: FilterChipOption[];
    value: FilterChipOption[];
    onChange: (selected: FilterChipOption[], clearWithCrossIcon?: boolean) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    searchLabel?: string;
    clearButtonLabel?: string;
    applyButtonLabel?: string;
    maxSelections?: number;
    enableSearch?: boolean;
    enableRangeFilter?: boolean;
    rangeLabel?: string;
    rangeMinPlaceholder?: string;
    rangeMaxPlaceholder?: string;
    rangeApplyLabel?: string;
    width?: string | number;
    height?: string | number;
}

const StyledSelect = styled(MuiSelect)<{ colors: any }>(({ colors }) => ({
    width: '100%',
    '& .MuiSelect-select': {
        padding: '8px 12px',
        minHeight: '40px',
        display: 'flex',
        alignItems: 'center',
        border: `1px solid ${colors.neutral200}`,
        borderRadius: '4px',
        backgroundColor: colors.neutral0,
        fontSize: '14px',
        lineHeight: '18px',
        '&:hover': {
            borderColor: colors.primary300,
        },
        '&.Mui-focused': {
            borderColor: `${colors.primary300} !important`,
            boxShadow: `0 0 0 1px ${colors.primary300}`,
        },
        '&:focus-within': {
            outline: 'none',
            borderColor: `${colors.primary300} !important`,
        },
    },
    '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        border: 'none',
    },
    '& .MuiChip-root': {
        margin: '2px 4px 2px 0',
        height: '24px',
        backgroundColor: colors.primary50,
        color: colors.primary700,
        borderRadius: '4px',
        '& .MuiChip-label': {
            padding: '0 8px',
            fontSize: '12px',
        },
        '&:hover': {
            backgroundColor: colors.primary100,
        },
        '& .MuiChip-deleteIcon': {
            color: colors.primary500,
            margin: '0 2px 0 -4px',
            '&:hover': {
                color: colors.primary700,
            },
        },
    },
}));

const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            width: 'auto',
            marginTop: 8,
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
        },
    },
    MenuListProps: {
        style: {
            padding: 0,
        }
    }
};

const SearchContainer = styled('div')<{ colors: any }>(({ colors }) => ({
    padding: '8px 16px',
    backgroundColor: colors.neutral0,
    position: 'sticky',
    top: 0,
    zIndex: 1,
    borderBottom: `1px solid ${colors.neutral200}`,
}));

const RangeContainer = styled('div')<{ colors: any }>(({ colors }) => ({
    display: 'flex',
    gap: '8px',
    padding: '8px 16px',
    backgroundColor: colors.neutral0,
    '& > *': {
        flex: 1,
    },
}));

const ActionsContainer = styled('div')<{ colors: any }>(({ colors }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 16px',
    borderTop: `1px solid ${colors.neutral200}`,
    backgroundColor: colors.neutral0,
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
}));

const FilterChipV2: React.FC<FilterChipV2Props> = ({
    options,
    value = [],
    onChange,
    placeholder = 'Select options...',
    searchPlaceholder = 'Search...',
    searchLabel = 'Search',
    clearButtonLabel = 'Clear',
    applyButtonLabel = 'Apply',
    maxSelections,
    enableSearch = true,
    enableRangeFilter = false,
    rangeLabel = 'Range',
    rangeMinPlaceholder = 'Min',
    rangeMaxPlaceholder = 'Max',
    rangeApplyLabel = 'Apply Range',
    width = '100%',
    height = 'auto',
    ...props
}) => {
    const { defaultTheme } = useAuthenticatedUser();
    const [searchTerm, setSearchTerm] = useState('');
    const [rangeType, setRangeType] = useState(false);
    const [rangeValues, setRangeValues] = useState({ min: '', max: '' });

    // Map backend palette → easy variables
    const colors = {
        primary50: getColor(defaultTheme, "primary50") ?? "#EEF2FF",
        primary100: getColor(defaultTheme, "primary100") ?? "#DBE4FF",
        primary200: getColor(defaultTheme, "primary200") ?? "#C7D2FE",
        primary300: getColor(defaultTheme, "primary300") ?? "#A5B4FC",
        primary400: getColor(defaultTheme, "primary400") ?? "#818CF8",
        primary500: getColor(defaultTheme, "primary500") ?? "#6366F1",
        primary600: getColor(defaultTheme, "primary600") ?? "#4F46E5",
        primary700: getColor(defaultTheme, "primary700") ?? "#4338CA",
        primary800: getColor(defaultTheme, "primary800") ?? "#3730A3",
        primary900: getColor(defaultTheme, "primary900") ?? "#312E81",

        // Neutral colors
        neutral0: getColor(defaultTheme, "neutral0") ?? "#FFFFFF",
        neutral50: getColor(defaultTheme, "neutral50") ?? "#F9FAFB",
        neutral100: getColor(defaultTheme, "neutral100") ?? "#F3F4F6",
        neutral200: getColor(defaultTheme, "neutral200") ?? "#E5E7EB",
        neutral300: getColor(defaultTheme, "neutral300") ?? "#D1D5DB",
        neutral400: getColor(defaultTheme, "neutral400") ?? "#9CA3AF",
        neutral500: getColor(defaultTheme, "neutral500") ?? "#6B7280",
        neutral600: getColor(defaultTheme, "neutral600") ?? "#4B5563",
        neutral700: getColor(defaultTheme, "neutral700") ?? "#374151",
        neutral800: getColor(defaultTheme, "neutral800") ?? "#1F2937",
        neutral900: getColor(defaultTheme, "neutral900") ?? "#111827",
    };

    const filteredOptions = useMemo(() => {
        if (!searchTerm) return options;
        const term = searchTerm.toLowerCase();
        return options.filter(option =>
            option.label.toLowerCase().includes(term)
        );
    }, [options, searchTerm]);

    const handleChange = (event: any) => {
        const selectedValues = event.target.value as (string | number)[];
        const selectedOptions = options.filter(option =>
            selectedValues.includes(option.value)
        );
        onChange(selectedOptions);
    };

    const handleDelete = (optionToDelete: FilterChipOption) => {
        const updatedOptions = value.filter(opt => String(opt.value) !== String(optionToDelete.value));
        onChange(updatedOptions, true);
    };

    const handleClear = () => {
        onChange([]);
    };

    const handleRangeChange = (field: 'min' | 'max', val: string) => {
        setRangeValues(prev => ({
            ...prev,
            [field]: val
        }));
    };

    const applyRangeFilter = () => {
        const min = parseFloat(rangeValues.min);
        const max = parseFloat(rangeValues.max);

        const filtered = options.filter(option => {
            const num = parseFloat(option.label);
            if (isNaN(num)) return false;
            return (!isNaN(min) ? num >= min : true) &&
                (!isNaN(max) ? num <= max : true);
        });

        onChange([...value, ...filtered].filter((v, i, a) =>
            a.findIndex(t => t.value === v.value) === i
        ));

        setRangeValues({ min: '', max: '' });
        setRangeType(false);
    };

    const renderValue = (selected: any) => {
        if (selected.length === 0) {
            return <span style={{ color: colors.neutral400 }}>{placeholder}</span>;
        }

        return (
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 0.5,
                maxWidth: '100%',
                overflow: 'hidden'
            }}>
                {selected.slice(0, 3).map((value: any) => {
                    const option = options.find(opt => opt.value === value);
                    if (!option) return null;
                    return (
                        <Box
                            key={option.value}
                            sx={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                backgroundColor: colors.primary50,
                                color: colors.primary700,
                                borderRadius: '4px',
                                px: 1,
                                py: 0.25,
                                fontSize: '12px',
                                height: '24px',
                                border: `1px solid ${colors.primary200}`,
                                maxWidth: '100%',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {option.label}
                            <CloseIcon
                                onMouseDown={(e) => {
                                    e.preventDefault();     // ✅ REQUIRED
                                    e.stopPropagation();    // ✅ REQUIRED
                                    handleDelete(option);   // ✅ Works now
                                }}
                                sx={{
                                    ml: 0.5,
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    color: colors.primary500,
                                    '&:hover': {
                                        color: colors.primary700,
                                    }
                                }}
                            />

                        </Box>
                    );
                })}
                {selected.length > 3 && (
                    <Box
                        component="span"
                        sx={{
                            backgroundColor: colors.neutral100,
                            color: colors.neutral700,
                            borderRadius: '4px',
                            px: 1,
                            py: 0.25,
                            fontSize: '12px',
                            height: '24px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            border: `1px solid ${colors.neutral200}`
                        }}
                    >
                        +{selected.length - 3} more
                    </Box>
                )}
            </Box>
        );
    };

    return (
        <Box sx={{ width, height }}>
            <StyledSelect
                multiple
                value={value.map(opt => opt.value)}
                onChange={handleChange}
                displayEmpty
                renderValue={renderValue}
                MenuProps={MenuProps}
                colors={colors}
                {...props}
            >
                {enableSearch && (
                    <SearchContainer colors={colors}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.stopPropagation()}   // ✅ THIS FIXES IT
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon
                                            fontSize="small"
                                            sx={{ color: 'neutral400' }}
                                        />
                                    </InputAdornment>
                                ),
                                sx: {
                                    backgroundColor: colors.neutral0,
                                    color: colors.neutral800,
                                    '& .MuiOutlinedInput-root': {
                                        '& fieldset': {
                                            borderColor: colors.neutral200,
                                        },
                                        '&:hover fieldset': {
                                            borderColor: colors.primary300,
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: colors.primary500,
                                            boxShadow: `0 0 0 1px ${colors.primary100}`,
                                        },
                                    }
                                }
                            }}
                        />
                        {enableRangeFilter && (
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                mt: 1,
                                justifyContent: 'space-between'
                            }}>
                                <Button
                                    variant="tertiaryText"
                                    size="small"
                                    startIcon={<BsArrowLeftRight />}
                                    onClick={() => setRangeType(!rangeType)}
                                    sx={{
                                        backgroundColor: rangeType ? 'primary50' : 'transparent',
                                        color: rangeType ? 'primary700' : 'neutral700',
                                        '&:hover': {
                                            backgroundColor: rangeType ? 'primary100' : 'neutral50',
                                        }
                                    }}
                                >
                                    {rangeLabel}
                                </Button>
                                {rangeType && (
                                    <Button
                                        variant="primaryContained"
                                        size="small"
                                        onClick={applyRangeFilter}
                                        disabled={!rangeValues.min && !rangeValues.max}
                                    >
                                        {rangeApplyLabel}
                                    </Button>
                                )}
                            </Box>
                        )}
                        {rangeType && (
                            <RangeContainer colors={colors}>
                                <TextField
                                    size="small"
                                    placeholder={rangeMinPlaceholder}
                                    value={rangeValues.min}
                                    onChange={(e) => handleRangeChange('min', e.target.value)}
                                    type="number"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.neutral200,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.primary300,
                                            },
                                        }
                                    }}
                                />
                                <TextField
                                    size="small"
                                    placeholder={rangeMaxPlaceholder}
                                    value={rangeValues.max}
                                    onChange={(e) => handleRangeChange('max', e.target.value)}
                                    type="number"
                                    fullWidth
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: colors.neutral200,
                                            },
                                            '&:hover fieldset': {
                                                borderColor: colors.primary300,
                                            },
                                        }
                                    }}
                                />
                            </RangeContainer>
                        )}
                    </SearchContainer>
                )}

                {filteredOptions.map((option) => (
                    <MenuItem
                        key={String(option.value)}
                        value={option.value}
                        onKeyDown={e => e.stopPropagation()}
                        sx={{
                            padding: '8px 12px',
                            minHeight: '40px',
                            backgroundColor: value.some(v => String(v.value) === String(option.value))
                                ? 'primary50'
                                : 'background.paper',
                            color: value.some(v => String(v.value) === String(option.value))
                                ? 'primary700'
                                : 'text.primary',
                            '&:hover': {
                                backgroundColor: 'primary100',
                            },
                            '&.Mui-selected': {
                                backgroundColor: 'primary50',
                                '&:hover': {
                                    backgroundColor: 'primary100',
                                }
                            }
                        }}
                    >
                        <Checkbox
                            checked={value.some(v => String(v.value) === String(option.value))}
                            size="small"
                            sx={{
                                color: 'neutral300',
                                padding: '4px',
                                '&.Mui-checked': {
                                    color: 'primary500',
                                },
                            }}
                        />
                        <ListItemText
                            primary={option.label}
                            primaryTypographyProps={{
                                sx: {
                                    fontSize: '14px',
                                    fontWeight: value.some(v => String(v.value) === String(option.value)) ? 500 : 400,
                                }
                            }}
                        />
                    </MenuItem>
                ))}

                <ActionsContainer colors={colors}>
                    <Button
                        variant="tertiaryText"
                        size="small"
                        onClick={handleClear}
                        disabled={value.length === 0}
                        sx={{
                            color: value.length === 0 ? 'neutral400' : 'primary500',
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        {clearButtonLabel}
                    </Button>
                    <Button
                        variant="primaryText"
                        size="small"
                        onClick={() => { }}
                        sx={{
                            '&:hover': {
                                backgroundColor: 'transparent',
                                textDecoration: 'underline',
                            }
                        }}
                    >
                        {applyButtonLabel}
                    </Button>
                </ActionsContainer>
            </StyledSelect>
        </Box>
    );
};

export default FilterChipV2;