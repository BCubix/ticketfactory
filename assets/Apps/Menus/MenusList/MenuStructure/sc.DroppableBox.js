import styled from '@emotion/styled';
import { Box } from '@mui/system';

export const DroppableBox = styled(Box)`
    min-height: ${(props) => (props.isDraggingOver && !props.isDragging ? '100px' : '0')};
    border: ${(props) =>
        props.isDraggingOver && !props.isDragging ? '2px dashed #D3D3D3' : 'none'};
    z-index: 10;
    width: 400px;
`;
