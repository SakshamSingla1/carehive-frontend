import React, { useMemo } from 'react';
import { createUseStyles } from 'react-jss';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { getColor } from '../../utils/helper';

interface ProgressBarProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  showStepNumbers?: boolean;
  className?: string;
  stepClassName?: string;
  barHeight?: number;
  stepSize?: number;
}

const useStyles = createUseStyles({
  container: {
    display: 'grid',
    width: '100%',
    margin: '0 auto',
    textAlign: 'center',
  },
  stepsContainer: (props: { stepCount: number }) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${props.stepCount}, minmax(0, 1fr))`,
    gap: '0.5rem',
    width: '100%',
  }),
  stepContainer: {
    display: 'grid',
    gap: '0.75rem',
  },
  stepHeader: {
    display: 'flex',
    gap: '0.5rem',
    margin: '0 auto',
    alignItems: 'center',
  },
  stepIndicator: (colors: any) => ({
    transition: 'all 0.3s ease',
    '&.completed': {
      backgroundColor: colors.primary600,
    },
    '&.active': {
      backgroundColor: colors.primary400,
    },
    '&.inactive': {
      backgroundColor: colors.neutral300,
    },
  }),
  stepLabel: (colors: any) => ({
    color: colors.neutral500,
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    '&.active, &.completed': {
      fontWeight: 600,
      color: colors.neutral700,
    },
  }),
  progressTrack: {
    width: '100%',
    borderRadius: '0.5rem',
    overflow: 'hidden',
  },
  progressFill: (colors: any) => ({
    height: '100%',
    transition: 'all 0.3s ease',
    '&.completed': {
      backgroundColor: colors.primary600,
    },
    '&.active': {
      backgroundColor: colors.primary400,
    },
    '&.inactive': {
      backgroundColor: colors.neutral200,
    },
  }),
});

const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  onStepClick,
  showStepNumbers = false,
  className = '',
  stepClassName = '',
  barHeight = 0.5,
  stepSize = 0.75,
}) => {
  const { defaultTheme } = useAuthenticatedUser();

  const colors = useMemo(
    () => ({
      primary600: getColor(defaultTheme, 'primary600') ?? '#3498db',
      primary400: getColor(defaultTheme, 'primary400') ?? '#5faee3',
      neutral300: getColor(defaultTheme, 'neutral300') ?? '#d1d5db',
      neutral500: getColor(defaultTheme, 'neutral500') ?? '#6b7280',
      neutral700: getColor(defaultTheme, 'neutral700') ?? '#374151',
      neutral200: getColor(defaultTheme, 'neutral200') ?? '#e5e7eb',
    }),
    [defaultTheme]
  );

  const classes = useStyles({ ...colors, stepCount: steps.length });

  const handleStepClick = (step: number) => {
    if (onStepClick && step < currentStep) {
      onStepClick(step);
    }
  };

  const getStepStatus = (index: number) => {
    const stepNumber = index + 1;
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'active';
    return 'inactive';
  };

  return (
    <div 
      className={`${classes.container} ${className}`}
      role="progressbar" 
      aria-valuenow={currentStep} 
      aria-valuemin={1} 
      aria-valuemax={steps.length}
    >
      <div className={classes.stepsContainer}>
        {steps.map((step, index) => {
          const status = getStepStatus(index);
          const stepNumber = index + 1;
          const isClickable = onStepClick && stepNumber < currentStep;

          return (
            <div
              key={`step-${index}`}
              className={`${classes.stepContainer} ${stepClassName}`}
              onClick={() => handleStepClick(stepNumber)}
              style={{ cursor: isClickable ? 'pointer' : 'default' }}
            >
              <div className={classes.stepHeader}>
                <div
                  className={`${classes.stepIndicator} ${status} rounded-full flex items-center justify-center`}
                  style={{
                    width: `${stepSize}rem`,
                    height: `${stepSize}rem`,
                    minWidth: `${stepSize}rem`,
                  }}
                  aria-current={status === 'active' ? 'step' : undefined}
                >
                  {showStepNumbers && (
                    <span className="text-white text-xs font-medium">
                      {stepNumber}
                    </span>
                  )}
                </div>
                <span className={`${classes.stepLabel} ${status}`}>
                  {step}
                </span>
              </div>
              <div 
                className={classes.progressTrack}
                style={{ height: `${barHeight}rem` }}
              >
                <div className={`${classes.progressFill} ${status}`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;