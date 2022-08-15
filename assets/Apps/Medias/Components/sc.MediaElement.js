import { Box, styled } from '@mui/system';

export const MediaElement = styled(Box)`
    width: 100%;
    padding: 8px;
    flex-shrink: 0;
    overflow: hidden;

    & > img {
        object-fit: cover;
        height: 200px;
    }

    ${(props) => props.theme.breakpoints.up('sm')} {
        width: 25%;
        & > img {
            height: 100px;
        }
    }

    ${(props) => props.theme.breakpoints.up('md')} {
        width: 16.66%;
        & > img {
            height: 100px;
        }
    }

    ${(props) => props.theme.breakpoints.up('lg')} {
        width: 12.5%;
        & > img {
            height: 100px;
        }
    }

    ${(props) => props.theme.breakpoints.up('xl')} {
        width: 10%;
        & > img {
            height: 100px;
        }
    }
`;
