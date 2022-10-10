import styled from '@emotion/styled';
import { Button, Fab } from '@mui/material';

export const CreateButton = styled(Button)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.create.textColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.create.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const ActionButton = styled(Button)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.action.textColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.action.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const EditFabButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.update.textColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.update.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const DeleteFabButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.delete.textColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.delete.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const DeleteBlockFabButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.delete.textColor};
    margin-block: 12px;
    position: absolute;
    top: -30px;
    right: -15px;
    height: 30px;
    width: 30px;
    min-height: 0;
    min-width: 0;
    border: ${(props) => `1px solid ${props.theme.palette.crud.delete.backgroundColor}`};
    box-shadow: none;

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.delete.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const ActionFabButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.action.textColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.action.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;

export const AddBlockButton = styled(Button)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.crud.create.textColor};
    border-color: ${(props) => props.theme.palette.crud.create.backgroundColor};

    &:hover {
        background-color: ${(props) => props.theme.palette.crud.create.backgroundColor};
        border-color: ${(props) => props.theme.palette.crud.create.backgroundColor};
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;
