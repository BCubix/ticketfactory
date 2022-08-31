import { FormControl } from '@mui/material';
import { Box, styled } from '@mui/system';

export const FieldElemWrapper = styled(Box)`
    margin-block: 10px;
    border-top: 1px solid #d3d3d3;
    padding: 10px;
`;

export const FieldFormControl = styled(FormControl)`
    & .MuiFormControlLabel-root {
        margin-top: 4px;
        display: flex;
        justify-content: flex-end;
        align-items: center;

        & .MuiFormControlLabel-label {
            width: 300px;
            flex-shrink: 0;
        }
    }
`;
