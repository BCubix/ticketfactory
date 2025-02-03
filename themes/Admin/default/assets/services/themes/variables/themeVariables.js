import { createBreakpoints } from '@mui/system';

export const defaultFamily = 'Rubik';
export const titleDefaultFamily = 'Anton';

export const themeBreakpointsVariables = {
    values: {
        xs: 0,
        sm: 480,
        md: 768,
        lg: 1024,
        xl: 1280,
    },
};

export const themeBreakpoints = createBreakpoints(themeBreakpointsVariables);
