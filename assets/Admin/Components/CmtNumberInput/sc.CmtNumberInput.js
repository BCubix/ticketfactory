import styled from '@emotion/styled';
import { TextField } from '@mui/material';
import { CmtTextField } from '../CmtTextField/CmtTextField';

export const CmtNumberInput = styled(TextField)`
    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": {
        display: "none",
    },
    "& input[type=number]": {
        MozAppearance: "textfield",
    },
`;
