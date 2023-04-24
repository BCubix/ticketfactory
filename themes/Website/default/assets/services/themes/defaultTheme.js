import { themeBreakpointsVariables, titleDefaultFamily } from './variables/themeVariables';
import { componentsTheme, typographyTheme } from './components/componentsTheme';
import { themeColors } from './variables/themeColors';
import { themeCrudColors } from './variables/themeCrudColors';
import { themeDateStatusColor } from './variables/themeDateStatusColor';
import { themeStatusColor } from './variables/themeStatusColor';
import { themeSidebarNavColor } from './variables/themeSidebarNavColor';
import { headerLayout } from './variables/headerTheme';
import { sidebarLayout } from './variables/sidebarTheme';

const defaultTheme = {
    breakpoints: themeBreakpointsVariables,

    spacing: 4,
    direction: 'ltr',

    layout: {
        header: headerLayout,
        sidebar: sidebarLayout,
    },

    palette: {
        titleDefaultFamily: titleDefaultFamily,
        type: 'light',
        ...themeColors,

        nav: themeSidebarNavColor,
        status: themeStatusColor,
        dateStatus: themeDateStatusColor,
        crud: themeCrudColors,
    },

    typography: typographyTheme,
    components: componentsTheme,
};

export default defaultTheme;
