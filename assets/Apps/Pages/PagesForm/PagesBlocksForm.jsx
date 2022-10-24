import React from 'react';
import { FieldArray } from 'formik';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { Card, CardContent, FormHelperText, InputLabel } from '@mui/material';
import { Box } from '@mui/system';
import { CmtEndPositionWrapper } from '@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper';
import { LightEditorFormControl } from '@Components/Editors/LightEditor/sc.LightEditorFormControl';
import LightEditor from '@Components/Editors/LightEditor/LightEditor';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { AddBlockButton, DeleteBlockFabButton } from '../../../Components/CmtButton/sc.Buttons';
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
                                    <DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </DeleteBlockFabButton>

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

                                    <FormHelperText error>
                                        {getNestedFormikError(
                                            touched?.pageBlocks,
                                            errors?.pageBlocks,
                                            index,
                                            'content'
                                        )}
                                    </FormHelperText>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <CmtEndPositionWrapper>
                        <AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
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
