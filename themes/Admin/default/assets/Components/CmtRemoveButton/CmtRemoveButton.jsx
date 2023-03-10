import { Fab } from '@mui/material';
import { styled } from '@mui/system';

export const CmtRemoveButton = styled(Fab)`
    position: absolute;
    top: -10px;
    right: -10px;
    height: 20px;
    width: 20px;
    min-height: 10px;
    font-size: 10px;
    color: #ffffff;
    background-color: ${(props) => props.theme.palette.crud.delete.textColor};
    &:hover {
        color: #ffffff;
        background-color: ${(props) => props.theme.palette.crud.delete.textColor};
    }
`;
