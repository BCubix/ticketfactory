import { createBreakpoints } from '@mui/system';

export const defaultFamily = 'Rubik';
export const titleDefaultFamily = 'Anton';

export const themeBreakpointsVariables = {
    values: {
        xs: 480,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1440,
    },
};

export const themeBreakpoints = createBreakpoints(themeBreakpointsVariables);
