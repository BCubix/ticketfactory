import styled from '@emotion/styled';
import { TableBody } from '@mui/material';

export const TBody = styled(TableBody, { shouldForwardProp: (prop) => prop !== 'isDragging' && prop !== 'isDraggingOver' })``;
