import { createBreakpoints } from '@mui/system';

const breakpoints = createBreakpoints({
    values: {
        xs: 480,
        sm: 768,
        md: 1024,
        lg: 1280,
        xl: 1440,
    },
});

const defaultFamily = 'Helvetica';

const defaultTheme = {
    breakpoints: {
        values: {
            xs: 480,
            sm: 768,
            md: 1024,
            lg: 1280,
            xl: 1440,
        },
    },

    spacing: 4,
    direction: 'ltr',

    palette: {
        type: 'light',
        common: {
            black: '#000',
            white: '#FFFFFF',
            dark: '#020202',
        },
        primary: {
            main: '#F07512',
            dark: '#C15D00',
            light: '#F7BA88',
            contrastText: '#fff',
            publicMain: '#F9F1E4',
            family: defaultFamily,
        },
        secondary: {
            main: '#194D9F',
            dark: '#16458F',
            light: '#1D5ABB',
            contrastText: '#fff',
        },
        success: {
            main: '#8DCD03',
            light: '#D7F5B1',
            dark: '#5D9405',
        },
        info: {
            main: '#0795F4',
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
            main: '#E00930',
            light: '#FFC7D1',
            dark: '#87061E',
        },
        disabled: {
            main: 'rgb(211, 211, 211)',
        },
    },

    components: {
        MuiTypography: {
            styleOverrides: {
                h1: {
                    fontFamily: defaultFamily,
                    fontSize: 20,
                    fontWeight: '500',
                    [breakpoints.up('md')]: {
                        fontSize: 22,
                    },
                },
                h2: {
                    fontFamily: defaultFamily,
                    fontSize: 18,
                    fontWeight: 'bold',
                    [breakpoints.up('md')]: {
                        fontSize: 20,
                    },
                },
                h3: {
                    fontFamily: defaultFamily,
                    fontSize: 16,
                    fontWeight: 'bold',
                    [breakpoints.up('md')]: {
                        fontSize: 18,
                    },
                },
                h4: {
                    fontFamily: defaultFamily,
                    fontSize: 16,
                    fontWeight: 'bold',
                },
                h5: {
                    fontFamily: defaultFamily,
                    fontSize: 14,
                    fontWeight: 400,
                },

                h6: {
                    fontFamily: defaultFamily,
                    fontSize: 10,
                    fontWeight: 400,
                    letterSpacing: 0.5,
                },

                subtitle1: {
                    fontFamily: defaultFamily,
                    fontSize: 18,
                    fontWeight: 500,
                    letterSpacing: 0.15,
                },
                subtitle2: {
                    fontFamily: defaultFamily,
                    fontSize: 10,
                    fontWeight: 400,
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                },
                body1: {
                    fontFamily: defaultFamily,
                    fontSize: 15,
                    fontWeight: 400,
                    letterSpacing: 0.5,
                },
                body2: {
                    fontFamily: defaultFamily,
                    fontSize: 14,
                    fontWeight: 400,
                    letterSpacing: 0.25,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                },
            },
        },
    },
};

export default defaultTheme;
