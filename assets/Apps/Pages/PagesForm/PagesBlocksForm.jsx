import React from 'react';
import {FieldArray} from "formik";

import {getNestedFormikError} from "@Services/utils/getNestedFormikError";

import {Button, InputLabel} from "@mui/material";
import {Box} from "@mui/system";

import {FieldElemWrapper} from "@Apps/ContentTypes/ContentTypesForm/sc.ContentTypeFields";
import {CmtEndPositionWrapper} from "@Components/CmtEndButtonWrapper/sc.CmtEndPositionWrapper";
import {LightEditorFormControl} from "@Components/Editors/LightEditor/sc.LightEditorFormControl";
import LightEditor from "@Components/Editors/LightEditor/LightEditor";

function PagesBlocksForm({values, errors, touched, setFieldValue, setFieldTouched}) {
    return (
        <FieldArray name="pageBlocks">
            {({remove, push}) => (
                <Box sx={{width: '100%'}}>
                    {values.pageBlocks?.map(({content}, index) => (
                        <FieldElemWrapper key={index}>
                            <InputLabel sx={{marginBottom: 3}} id={index}>Bloc n°{index + 1}</InputLabel>
                            <LightEditorFormControl>
                                <LightEditor
                                    labelId={index}
                                    value={content}
                                    onBlur={() => setFieldTouched(`pageBlocks.${index}.content`, true, false)}
                                    onChange={(val) => {
                                        setFieldValue(`pageBlocks.${index}.content`, val);
                                    }}
                                    error={getNestedFormikError(touched?.pageBlocks, errors?.pageBlocks, index, 'content')}
                                />
                            </LightEditorFormControl>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={() => {
                                    remove(index);
                                }}
                                sx={{marginTop: 3, marginBottom: 3}}
                            >
                                Supprimer
                            </Button>
                        </FieldElemWrapper>
                    ))}
                    <CmtEndPositionWrapper>
                        <Button
                            size="small"
                            color="primary"
                            variant="contained"
                            onClick={() => {
                                push({content: ''});
                            }}
                        >
                            Ajouter un contenu
                        </Button>
                    </CmtEndPositionWrapper>
                </Box>
            )}
        </FieldArray>
    );
}

export default PagesBlocksForm;