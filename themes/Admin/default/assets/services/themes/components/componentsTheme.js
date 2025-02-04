import { alpha } from '@mui/system';
import { defaultFamily, themeBreakpoints, titleDefaultFamily } from '../variables/themeVariables';

export const typographyTheme = {
    fontFamily: defaultFamily,
    fontSize: 14,
    h1: {
        fontSize: '1.5rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
        fontFamily: titleDefaultFamily,
    },
    h2: {
        fontSize: '1.4rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
        margin: '0 0 .5rem',
        fontFamily: titleDefaultFamily,
    },
    h3: {
        fontSize: '1.25rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
    },
    h4: {
        fontSize: '1.1rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
    },
    h5: {
        fontSize: '1rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
    },
    h6: {
        fontSize: '.875rem',
        lineHeight: 1.2,
        fontWeight: 400,
        color: '#37373C',
    },
    body1: {
        fontSize: '.875rem',
    },
    body2: {
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 0.25,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
};

export const componentsTheme = {
    MuiInputBase: {
        defaultProps: {
            disableInjectingGlobalStyles: true,
        },
    },
    MuiTableCell: {
        styleOverrides: {
            root: {
                borderColor: alpha('#000', 0.1),
            },
        },
    },
    MuiMenuItem: {
        styleOverrides: {
            root: {
                minHeight: 'auto',
            },
        },
    },
    MuiCardContent: {
        styleOverrides: {
            root: {
                padding: 8,
                [themeBreakpoints.up('md')]: {
                    padding: 24,
                },
            },
        },
    },
    MuiCardHeader: {
        styleOverrides: {
            root: {
                padding: '18px 24px',
            },
            title: {
                fontSize: '1.1rem',
                marginBottom: 0,
            },
            subheader: {
                margin: '4px 0 0',
            },
            action: {
                margin: 0,
            },
        },
    },
    MuiCardActions: {
        styleOverrides: {
            root: {
                padding: '8px 24px',
            },
        },
    },
    MuiChip: {
        styleOverrides: {
            sizeSmall: {
                height: 22,
                fontSize: 12,
            },
            sizeMedium: {
                height: 22,
                fontSize: 12,
                [themeBreakpoints.up('md')]: {
                    height: 32,
                    fontSize: 13,
                },
            },
        },
    },
    MuiButton: {
        styleOverrides: {
            root: {
                fontSize: 11,
                fontWeight: 400,
                letterSpacing: 1,
                [themeBreakpoints.up('md')]: {
                    fontSize: 14,
                },
            },
            sizeSmall: {
                fontSize: 10,
                [themeBreakpoints.up('sm')]: {
                    fontSize: 12,
                },
            },
        },
    },
    MuiSvgIcon: {
        styleOverrides: {
            fontSizeMedium: {
                height: 16,
                width: 16,
                [themeBreakpoints.up('sm')]: {
                    height: 24,
                    width: 24,
                },
            },
        },
    },
    MuiPaginationItem: {
        styleOverrides: {
            root: {
                fontSize: 12,
                fontWeight: 400,
                [themeBreakpoints.up('md')]: {
                    fontSize: 14,
                },
            },
        },
    },
    MuiPopover: {
        styleOverrides: {
            paper: {
                borderRadius: 8,
            },
        },
    },
    MuiDialogTitle: {
        styleOverrides: {
            root: {
                fontSize: 18,
            },
        },
    },
    MuiDialogActions: {
        styleOverrides: {
            root: {
                padding: '16px 24px',
            },
        },
    },
    MuiDialogContent: {
        styleOverrides: {
            root: {
                padding: 0,
                [themeBreakpoints.up('sm')]: {
                    padding: '20px 24px',
                },
            },
        },
    },
    MuiAvatarGroup: {
        styleOverrides: {
            avatar: {
                backgroundColor: '#757575',
                fontSize: 16,
            },
        },
    },
    MuiTypography: {
        styleOverrides: {
            // h1: {
            //     fontFamily: titleDefaultFamily,
            //     fontSize: 20,
            //     fontWeight: '500',
            //     [themeBreakpoints.up('md')]: {
            //         fontSize: 22,
            //     },
            // },
            h2: {
                fontFamily: titleDefaultFamily,
                fontSize: 18,
                fontWeight: '500',
                [themeBreakpoints.up('md')]: {
                    fontSize: 22,
                },
            },
            //         h3: {
            //             fontFamily: defaultFamily,
            //             fontSize: 16,
            //             fontWeight: '500',
            //             [themeBreakpoints.up('md')]: {
            //                 fontSize: 18,
            //             },
            //         },
            h4: {
                fontFamily: defaultFamily,
                fontSize: 15,
                fontWeight: 400,
                [themeBreakpoints.up('md')]: {
                    fontSize: 17,
                },
            },
            h5: {
                fontFamily: defaultFamily,
                fontSize: 14,
                fontWeight: 400,
                [themeBreakpoints.up('md')]: {
                    fontSize: 16,
                },
            },
            h6: {
                fontFamily: defaultFamily,
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: 0.5,
            },
            //         subtitle1: {
            //             fontFamily: defaultFamily,
            //             fontSize: 18,
            //             fontWeight: 500,
            //             letterSpacing: 0.15,
            //         },
            //         subtitle2: {
            //             fontFamily: defaultFamily,
            //             fontSize: 10,
            //             fontWeight: 400,
            //             letterSpacing: 1.5,
            //             textTransform: 'uppercase',
            //         },
            body1: {
                fontFamily: defaultFamily,
                fontSize: 12,
                fontWeight: 400,
                letterSpacing: 0.5,
                [themeBreakpoints.up('md')]: {
                    fontSize: 14,
                },
            },
            body2: {
                fontFamily: defaultFamily,
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: 0.25,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                [themeBreakpoints.up('md')]: {
                    fontSize: 15,
                },
            },
        },
    },
};
