import { createBreakpoints } from '@mui/system';

//export const defaultFamily = 'Kumbh Sans';
//export const titleDefaultFamily = 'Anton';

export const defaultFamily = 'NoirPro, Arial';
export const titleDefaultFamily = 'NoirPro, Arial';

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
