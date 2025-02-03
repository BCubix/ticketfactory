import styled from '@emotion/styled';
import { Box } from '@mui/material';

export const CmtMediaInfoBlock = styled(Box)`
    border-radius: 12px;
    margin-top: 16px;
    padding-inline: 20px;
    padding-block: 16px;
    background-color: ${(props) => props.theme.palette.main.backgroundColor};
`;
