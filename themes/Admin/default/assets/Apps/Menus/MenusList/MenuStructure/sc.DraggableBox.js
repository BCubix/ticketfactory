import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const DraggableBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'isDragging' })`
    ${(props) =>
        props.isDragging &&
        `
            left: auto !important;
            top: auto !important;
        `}
`;
