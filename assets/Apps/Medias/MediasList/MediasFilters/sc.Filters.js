import { styled } from '@mui/system';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

export const RotatingIcons = styled(ArrowUpwardIcon)`
    transform: ${(props) => props.order === 'DESC' && 'rotate(180deg)'};
    transition: 1s;
`;
