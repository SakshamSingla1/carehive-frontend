import React, { useState, useRef, useCallback, useMemo } from "react";
import TextField from '../atoms/TextField';
import Popover from "@mui/material/Popover";
import { HexColorPicker } from "react-colorful";
import { Check, ExpandMore } from "@mui/icons-material";

interface ColorPickerFieldProps extends Omit<React.ComponentProps<typeof TextField>, 'onChange' | 'value'> {
  value?: string;
  onChange?: (color: string) => void;
  showInput?: boolean;
  showPreview?: boolean;
  disabled?: boolean;
}

const isColorLight = (color: string): boolean => {
  const hex = color.replace('#', '');
  const [r, g, b] = hex.match(/.{2}/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
};

const ColorPickerField: React.FC<ColorPickerFieldProps> = ({ 
  value = "#aabbcc", 
  onChange,
  showInput = true,
  showPreview = true,
  disabled = false,
  ...textFieldProps 
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpen = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  }, []);

  const handleClose = useCallback(() => setAnchorEl(null), []);
  const handleChange = useCallback((color: string) => onChange?.(color), [onChange]);

  const checkIconStyle = useMemo(() => ({
    color: isColorLight(value) ? '#000' : '#fff',
    opacity: 0.8,
    fontSize: '16px',
  }), [value]);

  const getColorSwatchStyle = useCallback((size: number): React.CSSProperties => ({
    width: size,
    height: size,
    backgroundColor: value,
    padding: 0,
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }), [value]);

  const popoverStyle: React.CSSProperties = {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    backgroundColor: '#fff',
    borderRadius: '8px',
  };

  const inputContainerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingTop: '12px',
    borderTop: '1px solid #f0f0f0',
  };

  return (
    <div style={{ display: 'inline-block', position: 'relative' }}>
      <div 
        ref={inputRef}
        onClick={!disabled ? handleOpen : undefined}
        onMouseEnter={() => !disabled && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
        tabIndex={!disabled ? 0 : -1}
        aria-label={`Select color, currently ${value}`}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.7 : 1
        }}
      >
        {showInput ? (
          <TextField
            {...textFieldProps}
            value={value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (!disabled) {
                handleOpen(e as React.MouseEvent<HTMLDivElement>);
              }
            }}
            style={{ 
              cursor: disabled ? 'not-allowed' : 'pointer', 
              ...textFieldProps.style 
            }}
            InputProps={{
              startAdornment: (
                <div 
                  style={{ 
                    ...getColorSwatchStyle(32),
                    marginRight: '8px',
                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.2s ease',
                  }} 
                />
              ),
              endAdornment: (
                <ExpandMore style={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  transform: anchorEl ? 'rotate(180deg)' : 'none',
                  transition: 'transform 0.2s ease',
                }} />
              ),
              ...textFieldProps.InputProps,
            }}
            inputProps={{ 
              ...textFieldProps.inputProps, 
              readOnly: true,
              'aria-readonly': 'true'
            }}
            disabled={disabled}
          />
        ) : (
          <div 
            style={{ 
              ...getColorSwatchStyle(64), 
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.7 : 1
            }} 
            aria-label={`Color: ${value}`}
          >
            {anchorEl && <Check style={checkIconStyle} />}
          </div>
        )}
      </div>
      
      <Popover
        open={Boolean(anchorEl) && !disabled}
        anchorEl={anchorEl || undefined}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
      >
        <div style={popoverStyle}>
          <HexColorPicker 
            color={value} 
            onChange={handleChange}
            style={{ width: '250px', height: '200px' }}
          />
          {showInput && (
            <div style={inputContainerStyle}>
              <div style={getColorSwatchStyle(32)}>
                <Check style={checkIconStyle} />
              </div>
              <TextField
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
                style={{
                  padding: '8px 12px',
                  fontFamily: 'monospace',
                  outline: 'none',
                  width: '100%',
                }}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </Popover>
    </div>
  );
};

export default React.memo(ColorPickerField);