import styled from '@emotion/styled';
import { Paper } from '@mui/material';
import { alpha, Box } from '@mui/system';

export const LoginPageWrapper = styled(Box)`
    height: 100%;
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    min-width: 0;
    background-color: ${(props) => props.theme.palette.main.backgroundColor};

    ${(props) => props.theme.breakpoints.up('sm')} {
        flex-direction: row;
        justify-content: center;
    }

    ${(props) => props.theme.breakpoints.up('md')} {
        align-items: flex-start;
        justify-content: flex-start;
        border-left: ${(props) => `50px solid ${props.theme.palette.secondary.main}`};
    }
`;

export const LoginComponentWrapper = styled(Paper)`
    height: 100%;
    width: 100%;
    padding-block: 8px;
    padding-inline: 16px;
    border-right-width: 1px;
    flex-shrink: 0;

    ${(props) => props.theme.breakpoints.up('sm')} {
        height: auto;
        width: auto;
        box-shadow: ${(props) => `0 0.5rem 1.25rem ${props.theme.palette.primary.light}`};
        padding: 48px;
        border-radius: 16px;
    }

    ${(props) => props.theme.breakpoints.up('md')} {
        display: flex;
        justify-content: flex-start;
        height: 100%;
        width: 33%;
        padding: 28px;
        border-radius: 0;
        box-shadow: none;
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
        padding: 64px;
    }
`;

export const LoginBackgroundWrapper = styled(Box, { shouldForwardProp: (prop) => prop !== 'backgroundUrl' })`
    display: none;
    position: relative;
    height: 100%;
    width: 100%;

    ${(props) => props.theme.breakpoints.up('md')} {
        display: flex;
        flex-direction: column;
        padding-block: 28px;
        padding-inline: 64px;
        background: ${(props) => `center / cover no-repeat url('${props.backgroundUrl}')`};

        &::before {
            content: '';
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0px;
            background-color: ${(props) => alpha(props.theme.palette.primary.main, 0.4)};
        }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
        padding-block: 64px;
        padding-inline: 112px;
    }
`;
