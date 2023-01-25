import styled from '@emotion/styled';
import { Chip, Fab } from '@mui/material';

export const ClearBooleanButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.delete.textColor};
    height: 30px;
    margin-left: 15px;
    width: 30px;
    min-height: 0;
    min-width: 0;
    border: ${(props) => `1px solid ${props.theme.palette.crud.delete.backgroundColor}`};
    box-shadow: none;

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.delete.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const FilterChip = styled(Chip)`
    background-color: ${(props) => (props.isActive ? props.theme.palette.secondary.light : '#FFFFFF')};

    &:hover {
        background-color: ${(props) => (props.isActive ? props.theme.palette.secondary.light : '#E3E3E3')} !important;
    }
`;
