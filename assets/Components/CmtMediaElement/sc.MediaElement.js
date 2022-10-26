import { Card } from '@mui/material';
import { Box, styled } from '@mui/system';

export const CmtMediaElement = styled(Card)`
    width: 100%;
    margin: 8px;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    cursor: pointer;

    & > img {
        object-fit: cover;
        height: 200px;
    }
    & > .placeholder {
        height: 200px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: ${(props) => props.theme.palette.crud.create.backgroundColor};
        & > .MuiSvgIcon-root {
            font-size: 70px;
        }
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
        width: 25%;
        & > img {
            height: 100px;
        }
        & > .placeholder {
            height: 100px;
            & > .MuiSvgIcon-root {
                font-size: 40px;
            }
        }
    }

    ${(props) => props.theme.breakpoints.up('md')} {
        width: 16.66%;
        & > img {
            height: 100px;
        }
        & > .placeholder {
            height: 100px;
            & > .MuiSvgIcon-root {
                font-size: 50px;
            }
        }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
        width: 12.5%;
        & > img {
            height: 100px;
        }
        & > .placeholder {
            height: 100px;
            & > .MuiSvgIcon-root {
                font-size: 60px;
            }
        }
    }

    ${(props) => props.theme.breakpoints.up('xl')} {
        width: 10%;
        & > img {
            height: 100px;
        }
        & > .placeholder {
            height: 100px;
            & > .MuiSvgIcon-root {
                font-size: 70px;
            }
        }
    }
`;
