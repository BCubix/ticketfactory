import styled from '@emotion/styled';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

export const ActiveFieldBlock = styled(Box)`
    margin-right: ${(props) => (null !== props.mr ? props.mr : '10px')};
    height: 36px;
    display: flex;
    align-items: center;
    padding-inline: 10px;
    border: ${(props) => `1px solid ${props.theme.palette.primary.main}`};
    border-radius: 3px;
    background-color: ${(props) => props.theme.palette.secondary.light};
`;

export const SwitchActiveLabel = styled(Typography)`
    text-transform: uppercase;
    padding-inline: 5px;
`;

export const SwitchTextLabel = styled(Typography)`
    text-transform: uppercase;
    padding-right: 10px;
`;
