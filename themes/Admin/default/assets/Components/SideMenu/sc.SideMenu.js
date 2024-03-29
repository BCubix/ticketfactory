import styled from '@emotion/styled';
import { ListItemButton, ListSubheader } from '@mui/material';

export const MenuTitle = styled(ListSubheader)`
    font-size: 80%;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    bgcolor: transparent;
    padding: 30px 30px 15px;
    color: ${(props) => props.theme.palette.sidebar.menuTitleText};
`;

export const MenuItemButton = styled(ListItemButton, { shouldForwardProp: (prop) => prop !== 'isActive' })`
    padding: 0;
    border-radius: 0 24px 24px 0;
    margin: 0;
    color: ${(props) => (props.isActive ? props.theme.palette.primary.main : props.theme.palette.nav.mainColor)};
    background-color: ${(props) => props.isActive && props.theme.palette.primary.light};
    transition: 0.3s;

    &::before {
        left: 0;
        top: 0;
        content: '';
        position: absolute;
        display: inline-block;
        width: 4px;
        height: 100%;
        background-color: ${(props) => (props.isActive ? props.theme.palette.primary.main : 'transparent')};
    }

    &:hover {
        color: ${(props) => props.theme.palette.primary.main};
        background-color: ${(props) => props.theme.palette.primary.light};

        &::before {
            left: 0;
            top: 0;
            content: '';
            position: 'absolute';
            display: 'inline-block';
            width: '4px';
            height: '100%';
            background-color: ${(props) => props.theme.palette.primary.main};
        }
    }
`;
