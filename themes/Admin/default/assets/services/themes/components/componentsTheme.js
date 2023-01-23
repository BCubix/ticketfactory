import { defaultFamily, themeBreakpoints, titleDefaultFamily } from '../variables/themeVariables';

export const componentsTheme = {
    MuiTypography: {
        styleOverrides: {
            h1: {
                fontFamily: titleDefaultFamily,
                fontSize: 20,
                fontWeight: '500',
                [themeBreakpoints.up('md')]: {
                    fontSize: 22,
                },
            },
            h2: {
                fontFamily: defaultFamily,
                fontSize: 18,
                fontWeight: '500',
                [themeBreakpoints.up('md')]: {
                    fontSize: 20,
                },
            },
            h3: {
                fontFamily: defaultFamily,
                fontSize: 16,
                fontWeight: '500',
                [themeBreakpoints.up('md')]: {
                    fontSize: 18,
                },
            },
            h4: {
                fontFamily: defaultFamily,
                fontSize: 16,
                fontWeight: '500',
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
};
