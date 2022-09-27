import React from 'react';
import { FieldArray } from 'formik';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { Button, Card, CardContent, Fab, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { FieldElemWrapper } from '@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields';
import { CmtEndPositionWrapper } from '@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { LightEditorFormControl } from '@Components/Editors/LightEditor/sc.LightEditorFormControl';
import LightEditor from '@Components/Editors/LightEditor/LightEditor';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    AddBlockButton,
    CreateButton,
    DeleteFabButton,
} from '../../../Components/CmtButton/sc.Buttons';
import { useTheme } from '@emotion/react';

function PagesBlocksForm({ values, errors, touched, setFieldValue, setFieldTouched }) {
    const theme = useTheme();

    return (
        <FieldArray name="pageBlocks">
            {({ remove, push }) => (
                <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                    {values.pageBlocks?.map(({ content }, index) => (
                        <Card
                            key={index}
                            sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }}
                        >
                            <CardContent>
                                <Box p={2}>
                                    <DeleteFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                        sx={{
                                            marginTop: 3,
                                            marginBottom: 3,
                                            position: 'absolute',
                                            top: -30,
                                            right: -15,
                                            height: 30,
                                            width: 30,
                                            minHeight: 0,
                                            minWidth: 0,
                                        }}
                                    >
                                        <DeleteIcon />
                                    </DeleteFabButton>

                                    <InputLabel sx={{ marginBottom: 3 }} id={index}>
                                        Bloc n°{index + 1}
                                    </InputLabel>

                                    <LightEditorFormControl>
                                        <LightEditor
                                            labelId={index}
                                            value={content}
                                            onBlur={() =>
                                                setFieldTouched(
                                                    `pageBlocks.${index}.content`,
                                                    true,
                                                    false
                                                )
                                            }
                                            onChange={(val) => {
                                                setFieldValue(`pageBlocks.${index}.content`, val);
                                            }}
                                            error={getNestedFormikError(
                                                touched?.pageBlocks,
                                                errors?.pageBlocks,
                                                index,
                                                'content'
                                            )}
                                        />
                                    </LightEditorFormControl>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <CmtEndPositionWrapper>
                        <AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            sx={{ borderColor: theme.palette.crud.create.backgroundColor }}
                            onClick={() => {
                                push({ content: '' });
                            }}
                        >
                            <AddIcon /> Ajouter un contenu
                        </AddBlockButton>
                    </CmtEndPositionWrapper>
                </Box>
            )}
        </FieldArray>
    );
}

export default PagesBlocksForm;
