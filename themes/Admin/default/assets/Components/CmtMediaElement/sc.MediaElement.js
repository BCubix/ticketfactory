import { Card } from '@mui/material';
import { styled } from '@mui/system';

export const CmtMediaElement = styled(Card)`
    width: 100%;
    margin: 8px;
    flex-shrink: 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    cursor: pointer;
    position: relative;

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

    &:hover {
        &.eventMediaElement {
            position: relative;

            &:after {
                content: '';
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(255, 255, 255, 0.6);
                z-index: 2;
                transition: 0.3s;
            }

            .eventMediaType {
                filter: blur(1px);
            }

            .showOnHover {
                opacity: 1;
                z-index: 5;
            }
        }
    }

    .eventMediaType {
        transition: 0.3s;
    }

    .showOnHover {
        transition: 0.3s;
        opacity: 0;
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
