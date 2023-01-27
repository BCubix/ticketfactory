import styled from '@emotion/styled';
import { Card, CardHeader } from '@mui/material';

export const CmtCard = styled(Card)`
    background-color: ${(props) => props.theme.palette.cardBackground};
    overflow: ${(props) => props.overflow || 'visible'};
    border-radius: 12px;
    box-shadow: ${(props) => `0 0.5rem 1.25rem ${props.theme.palette.primary.light}`};
`;

export const CmtCardHeader = styled(CardHeader)`
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
    background-color: ${(props) => props.theme.palette.primary.light};
    padding-block: 10px;

    & .MuiCardHeader-title {
        color: ${(props) => props.theme.palette.primary.dark};
    }
`;
