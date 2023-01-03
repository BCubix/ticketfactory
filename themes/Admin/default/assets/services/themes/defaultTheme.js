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
            main: '#980B27',
            dark: '#980B27',
            light: '#980B27',
            contrastText: '#FFFFFF',
            publicMain: '#F9F1E4',
            family: defaultFamily,
        },
        secondary: {
            main: '#02374D',
            dark: '#16458F',
            light: '#1D5ABB',
            contrastText: '#FFFFFF',
        },
        tertiary: {
            main: '#27E3B1',
        },

        status: {
            info: {
                backgroundColor: '#A5D6A7',
                textColor: '#1B5E20',
            },

            warning: {
                backgroundColor: '#FFE082',
                textColor: '#FFAB00',
            },

            error: {
                backgroundColor: '#EF9A9A',
                textColor: '#B71C1C',
            },

            critical: {
                backgroundColor: '#212121',
                textColor: '#EEEEEE',
            },
        },

        dateStatus: {
            valid: '#A5D6A7',
            reported: '#FFE082',
            canceled: '#EF9A9A',
            newDate: '#90CAF9',
        },

        crud: {
            create: {
                backgroundColor: '#A5D6A7',
                textColor: '#1B5E20',
            },

            update: {
                backgroundColor: '#FFE082',
                textColor: '#FFAB00',
            },

            delete: {
                backgroundColor: '#EF9A9A',
                textColor: '#B71C1C',
            },

            action: {
                backgroundColor: '#90CAF9',
                textColor: '#0D47A1',
            },
        },

        cardBackground: '#F5F5F5',

        success: {
            main: '#8DCD03',
            light: '#D7F5B1',
            dark: '#5D9405',
        },
        info: {
            main: '#FFAB00',
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
