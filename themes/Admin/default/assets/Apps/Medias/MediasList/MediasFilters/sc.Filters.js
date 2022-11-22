import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { styled } from '@mui/system';

export const RotatingIcons = styled(ArrowUpwardIcon)`
    transform: ${(props) => props.order === 'DESC' && 'rotate(180deg)'};
    transition: 1s;
`;
