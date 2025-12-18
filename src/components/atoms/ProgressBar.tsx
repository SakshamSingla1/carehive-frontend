import React from 'react';
import { createUseStyles } from 'react-jss';
import { useAuthenticatedUser } from '../../hooks/useAuthenticatedUser';
import { getColor } from '../../utils/helper';

interface ProgressBarProps {
    steps: string[];
    currentStep: number;
}

const useStyles = createUseStyles({
    previousProgressBar: (colors:any) => ({
        backgroundColor: colors.primary600
    }),
    activeProgressBar: (colors:any) => ({
        backgroundColor: colors.primary400
    }),
    inActiveProgressBar: (colors:any) => ({
        backgroundColor: colors.neutral300
    }),
    barHeading: (colors:any) => ({
        color: colors.neutral500
    }),
});

const ProgressBar: React.FC<ProgressBarProps> = ({ steps, currentStep }) => {
    const { defaultTheme } = useAuthenticatedUser();

    const colors = {
        primary600: getColor(defaultTheme, "primary600") ?? "#3498db",
        primary400: getColor(defaultTheme, "primary400") ?? "#3498db",
        neutral300: getColor(defaultTheme, "neutral300") ?? "#3498db",
        neutral500: getColor(defaultTheme, "neutral500") ?? "#3498db",
    }

    const classes = useStyles(colors);

    return (

        <div className={`w-full m-auto grid grid-cols-${steps.length} justify-between gap-x-2 text-center text-sm `}>
            {steps.map((step, index) => {
                const isCompleted = (index + 1) < currentStep;
                const isActive = (index + 1) === currentStep;
                return (
                    <div className="grid gap-y-3">
                        <div className='flex gap-x-2 mx-auto'>
                            <div className={`${isCompleted ? `${classes.previousProgressBar} w-3 h-3` : isActive ? `${classes.activeProgressBar} w-3 h-3` : `${classes.inActiveProgressBar} w-2 h-2`}  my-auto rounded-full`}></div>
                            <div className={`${classes.barHeading} my-auto text-sm ${isActive || isCompleted ? "font-semibold" : ""}`}>{step}</div>
                        </div>
                        <div className={`${isCompleted ? classes.previousProgressBar : isActive ? classes.activeProgressBar : classes.inActiveProgressBar} h-2.5 rounded `}></div>
                    </div>
                );
            })}

        </div>
    );
};

export default ProgressBar;