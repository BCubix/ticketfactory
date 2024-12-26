import { styled } from '@mui/material/styles';
import { Box, Typography, TableCell, Button, TableContainer, Paper } from '@mui/material';
import { alpha } from '@mui/material/styles';
// Styled components for custom styling

export const CustomTableCell = styled(TableCell, {
    shouldForwardProp: (prop) => prop !== 'isSelectedDay',
  })`
  position: relative;
  cursor: pointer;
  border-radius: 10px;
  background-color: ${(props) => (props.isSelectedDay ? alpha(props.theme.palette.primary.main, 0.2) : 'inherit')};
  color: ${(props) => (props.isSelectedDay ? props.theme.palette.primary.main : 'inherit')};
`;

export const DayLabel =styled(Typography, {
    shouldForwardProp: (prop) => prop !== 'isCurrentDay',
  })`
  width: 24px;
  height: 22px;
  margin: auto;
  display: block;
  padding-top: 2px;
  border-radius: 50%;
  background: ${(props) => (props.isCurrentDay ? props.theme.palette.primary.main : 'inherit')};
  color: ${(props) => (props.isCurrentDay ? '#fff' : 'inherit')};
`;

export const SelectedTimeBox = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'isSelectedTime',
  })`
  padding: 8px 16px;
  border: 2px solid ${(props) => (props.isSelectedTime ? props.theme.palette.primary.main : props.theme.palette.divider)};
  border-radius: 16px;
  cursor: pointer;
  background-color: ${(props) => (props.isSelectedTime ? props.theme.palette.primary.light : 'inherit')};
  color: ${(props) => (props.isSelectedTime ? props.theme.palette.primary.main : 'inherit')};
  text-align: center;
  min-width: 60px;
`;

export const CustomTableContainer = styled(TableContainer)`
  box-shadow: none;
`;

export const CustomPaper = styled(Paper)`
  padding: 16px;
  border-radius: 1px;
  border: 1px solid ${(props) => props.theme.palette.divider};
  box-shadow: none;
`;