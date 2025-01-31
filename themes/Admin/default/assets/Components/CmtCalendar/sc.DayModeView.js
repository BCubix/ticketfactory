import { styled } from '@mui/material/styles';
import { TableCell, TableContainer, tableCellClasses } from "@mui/material";

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    borderLeft: `1px solid #ccc !important`,
    '&:nth-of-type(1)': { borderLeft: `0px !important` },
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
    height: 16,
    width: 128,
    maxWidth: 128,
    cursor: 'pointer',
    borderLeft: `1px solid #ccc`,
    '&:nth-of-type(1)': {
      width: 80,
      maxWidth: 80,
    },
    '&:nth-of-type(8n+1)': { borderLeft: 0 },
  },
  [`&.${tableCellClasses.body}:hover`]: {
    backgroundColor: "#eee",
  },
}));

export const DayModeStyledCell = styled(StyledTableCell)(({ theme }) => ({
    padding: 0,
    height: '100%',
    position: 'relative',
    borderRadius: 0,
    overflow:'visible',
  }));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  '&::-webkit-scrollbar': {
    width: 7,
    height: 6,
  },
  '&::-webkit-scrollbar-track': {
    WebkitBoxShadow: "inset 0 0 6px rgba(125, 161, 196, 0.5)",
  },
  '&::-webkit-scrollbar-thumb': {
    WebkitBorderRadius: 4,
    borderRadius: 4,
    background: "rgba(0, 172, 193, .5)",
    WebkitBoxShadow: "inset 0 0 6px rgba(25, 118, 210, .5)",
  },
  '&::-webkit-scrollbar-thumb:window-inactive': {
    background: "rgba(125, 161, 196, 0.5)",
  },
}));
