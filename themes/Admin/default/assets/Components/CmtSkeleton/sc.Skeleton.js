import styled from '@emotion/styled';

import { Box, Skeleton } from '@mui/material';

export const StyledBox = styled(Box)(({ mt, mb, ml, mr, p, display, flex, flexDirection, gap, pb, alignItems, width, backgroundColor, padding, borderRadius }) => ({
    marginTop: mt || 0,
    marginBottom: mb || 0,
    marginLeft: ml || 0,
    marginRight: mr || 0,
    padding: p || 0,
    display: display || 'block',
    flex: flex || 1,
    flexDirection: flexDirection || 'row',
    gap: gap || 0,
    paddingBottom: pb || 0,
    alignItems: alignItems || 'stretch',
    width: width || 'auto',
    backgroundColor: backgroundColor || 'transparent',
    borderRadius: borderRadius || 0,
}));

export const ColoredSkeleton = styled(Skeleton, {
    shouldForwardProp: (prop) => prop !== 'color',
})(({ theme, color }) => ({
    backgroundColor: typeof color === 'function' ? color(theme) : color,
}));

//Content List
export const ContentListBox = styled(Box)(({ contentMargin }) => ({
    marginRight: `${contentMargin}px`,
    padding: 8,
    height: '100%',
}));
//End content list

//Form
export const RandomSkeleton = styled(Skeleton)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    borderRadius: 1,
    marginBottom: 2,
}));
//End form
