import { themeBreakpointsVariables, titleDefaultFamily } from './variables/themeVariables';
import { componentsTheme } from './components/componentsTheme';
import { themeColors } from './variables/themeColors';
import { themeCrudColors } from './variables/themeCrudColors';
import { themeDateStatusColor } from './variables/themeDateStatusColor';
import { themeStatusColor } from './variables/themeStatusColor';
import { themeSidebarNavColor } from './variables/themeSidebarNavColor';

const defaultTheme = {
    breakpoints: themeBreakpointsVariables,

    spacing: 4,
    direction: 'ltr',

    palette: {
        titleDefaultFamily: titleDefaultFamily,
        type: 'light',
        ...themeColors,

        nav: themeSidebarNavColor,
        status: themeStatusColor,
        dateStatus: themeDateStatusColor,
        crud: themeCrudColors,
    },

    components: componentsTheme,
};

export default defaultTheme;
