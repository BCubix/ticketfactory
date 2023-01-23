import { ListItemButton, ListSubheader, Typography } from '@mui/material';
import { alpha, styled } from '@mui/system';

export const MenuTitle = styled(ListSubheader)`
    font-size: 80%;
    font-weight: 400;
    line-height: normal;
    text-transform: uppercase;
    bgcolor: transparent;
    padding: 30px 30px 15px;
`;

export const MenuItemButton = styled(ListItemButton)`
    padding: 0;
    border-radius: 0 24px 24px 0;
    margin: 0;
    color: ${(props) => (props.isActive ? props.theme.palette.nav.action.active : props.theme.palette.nav.mainColor)};
    background-color: ${(props) => props.isActive && alpha(props.theme.palette.nav.background.active, 0.15)};

    &::before {
        left: 0;
        top: 0;
        content: '';
        position: absolute;
        display: inline-block;
        width: 4px;
        height: 100%;
        background-color: ${(props) => (props.isActive ? props.theme.palette.nav.tick.active : 'transparent')};
    }

    &:hover {
        color: ${(props) => props.theme.palette.nav.action.hover};
        background-color: ${(props) => props.theme.palette.nav.background.hover};

        &::before {
            left: 0;
            top: 0;
            content: '';
            position: 'absolute';
            display: 'inline-block';
            width: '4px';
            height: '100%';
            background-color: ${(props) => props.theme.palette.nav.tick.hover};
        }
    }
`;
