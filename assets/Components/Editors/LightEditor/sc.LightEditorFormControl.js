import { FormControl } from '@mui/material';
import { styled } from '@mui/system';

export const LightEditorFormControl = styled(FormControl)`
    width: 100%;
    & .ck-editor__editable {
        width: 100%;
        min-height: 40vh;
        ${(props) => props.theme.breakpoints.down('sm')} {
            min-height: 30vh;
            height: 30vh;
        }
    }
`;
