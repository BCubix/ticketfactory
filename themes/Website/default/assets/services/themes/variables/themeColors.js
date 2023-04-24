import { headerTheme } from './headerTheme';
import { mainPartTheme } from './mainPartTheme';
import { sidebarTheme } from './sidebarTheme';
import { defaultFamily } from './themeVariables';

export const themeColors = {
    common: {
        black: '#000',
        white: '#FFFFFF',
        dark: '#020202',
    },

    primary: {
        main: '#2E71B3',
        dark: '#225486',
        light: '#EBF1FF',
        contrastText: '#FFFFFF',
        family: defaultFamily,
    },

    secondary: {
        main: '#FFC828',
        dark: '#225486',
        light: '#FFF3E5',
        contrastText: '#FFFFFF',
    },

    tertiary: {
        main: '#F71047',
        light: '#E3E3E3',
    },

    fourth: {
        main: '#FFF3E5',
    },

    success: {
        main: '#8DCD03',
        light: '#D7F5B1',
        dark: '#5D9405',
    },

    info: {
        main: '#0288D1',
        light: '#9BE7FD',
        dark: '#0356AF',
    },

    warning: {
        main: '#FF8C00',
        light: '#FFDE99',
        dark: '#D36F1A',
        contrastText: '#fff',
    },

    error: {
        main: '#B71C1C',
        light: '#FFC7D1',
        dark: '#87061E',
    },

    disabled: {
        main: 'rgb(211, 211, 211)',
    },

    labelColor: 'rgba(0, 0, 0, 0.6)',

    picto: {
        pictoColor: '#2E71B3',
    },

    cardBackground: '#FFFFFF',

    main: mainPartTheme,
    header: headerTheme,
    sidebar: sidebarTheme,
};

/* primary: {
    main: '#2E71B3',
    dark: '#2E71B3',
    light: '#2E71B3',
    contrastText: '#fff',
    publicMain: '#F9F1E4',
    family: defaultFamily,
},

secondary: {
    main: '#2E71B3',
    dark: '#16458F',
    light: '#1D5ABB',
    contrastText: '#FFFFFF',
},

tertiary: {
    main: '#FFC828',
}, */
