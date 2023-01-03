import styled from '@emotion/styled';
import { Typography } from '@mui/material';

export const HistoryDateTypo = styled(Typography)`
    transition: 1s;
    cursor: pointer;
    background-color: ${(props) => props.selectedHistory && props.theme.palette.primary.light};
    color: ${(props) => props.selectedHistory && props.theme.palette.primary.contrastText};

    &:hover {
        background-color: ${(props) => props.theme.palette.primary.light};
        color: ${(props) => props.theme.palette.primary.contrastText};
    }
`;
