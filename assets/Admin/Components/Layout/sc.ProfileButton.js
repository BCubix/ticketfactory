import styled from '@emotion/styled';
import { Fab } from '@mui/material';

export const ProfileButton = styled(Fab)`
    background-color: #ffffff;
    color: ${(props) => props.theme.palette.primary.main};
    border-color: ${(props) => props.theme.palette.primary.main};

    &:hover {
        background-color: ${(props) => props.theme.palette.primary.main};
        border-color: ${(props) => props.theme.palette.primary.main};
        color: #ffffff;
        box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12),
            0 3px 1px -1px rgba(0, 0, 0, 0.2);
    }
`;
