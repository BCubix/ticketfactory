import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const FeatureDroppableBox = styled(Box, { shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDraggingOver' })`
    border: ${(props) => (props.isDraggingOver && !props.isDragging ? '2px dashed #D3D3D3' : 'none')};
    z-index: 10;
    width: 100%;
`;
