import { Chip } from '@mui/material';
import { styled, emphasize } from '@mui/system';

export const StyledBreadCrumb = styled(Chip)(({ theme }) => {
    const backgroundColor = '#D3D3D3';

    return {
        backgroundColor,
        height: theme.spacing(3),
        fontWeight: '400',
        '&:hover, &:focus': {
            backgroundColor: emphasize(backgroundColor, 0.06),
        },
        '&:active': {
            backgroundColor: emphasize(backgroundColor, 0.12),
        },
    };
});
