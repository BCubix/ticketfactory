import styled from '@emotion/styled';
import { TableRow } from '@mui/material';

export const TRow = styled(TableRow, { shouldForwardProp: (prop) => prop !== 'isDragging' })``;
