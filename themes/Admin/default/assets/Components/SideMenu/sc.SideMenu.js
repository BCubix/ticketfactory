import { Typography } from '@mui/material';
import { styled } from '@mui/system';

export const MenuTitle = styled(Typography)`
    font-weight: 400;
    font-size: 18px;
    margin-left: 10px;
    margin-top: 20px;
    line-height: 1;
    letter-spacing: 1px;
    font-family: ${(props) => props.theme.palette.titleDefaultFamily};
`;
