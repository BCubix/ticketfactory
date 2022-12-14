import React, { useState } from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import {
    Card,
    CardContent,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    FormControlLabel,
    Grid,
    InputLabel,
    Radio,
    Tab,
    Tabs,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Component } from '@/AdminService/Component';
import { GetPageBlockColumn } from '../../PageBlocks/CreatePageBlock/CreatePageBlockFormat';
import { getNestedFormikError } from '../../../services/utils/getNestedFormikError';

const DisplayAddPageBlockModal = ({ push, isOpen, close }) => {
    const [newBlockMode, setNewBlockMode] = useState('create');

    const [name, setName] = useState('');
    const [saveAsModel, setSaveAsModel] = useState(false);
    const [formatIndex, setFormatIndex] = useState(0);

    const handleCreate = () => {
        const columns = [];
        Constant.PAGE_BLOCKS_FORMATS[formatIndex].forEach((value) => {
            columns.push(GetPageBlockColumn(value));
        });

        console.log(saveAsModel);
        push({
            name: name,
            saveAsModel: saveAsModel,
            columns: columns,
        });

        close();
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth maxWidth="md">
            <Tabs
                value={newBlockMode}
                onChange={(_, newValue) => {
                    setNewBlockMode(newValue);
                }}
                aria-label="page block tabs"
            >
                <Tab label="Créer un nouveau bloc" value="create" />
                <Tab label="Importer un bloc existant" value="import" />
            </Tabs>

            <DialogContent sx={{ minHeight: 300 }}>
                {newBlockMode === 'create' && (
                    <>
                        <Component.CreatePageBlockFormat
                            name={name}
                            setName={setName}
                            formatIndex={formatIndex}
                            setFormatIndex={setFormatIndex}
                            displaySave={true}
                            saveAsModel={saveAsModel}
                            setSaveAsModel={setSaveAsModel}
                        />
                    </>
                )}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Component.CreateButton variant="contained" onClick={handleCreate}>
                    Créer
                </Component.CreateButton>
            </DialogActions>
        </Dialog>
    );
};

export const PagesBlocksPart = ({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur }) => {
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [view, setView] = useState('xl');

    return (
        <FieldArray name="pageBlocks">
            {({ remove, push }) => (
                <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                    {values.pageBlocks?.map((pageBlock, index) => (
                        <Card key={index} sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }}>
                            <CardContent>
                                <InputLabel>Bloc n°{index + 1}</InputLabel>

                                <Grid container spacing={4} sx={{ paddingLeft: 13 }}>
                                    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Component.CmtTextField
                                            value={pageBlock.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            label="Nom du bloc"
                                            name={`pageBlocks.${index}.name`}
                                            error={getNestedFormikError(touched?.pageBlocks, errors?.pageBlocks, index, 'name')}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <FormControlLabel
                                            size="small"
                                            value={pageBlock.saveAsModel}
                                            onChange={(e) => {
                                                setFieldValue(`pageBlocks.${index}.saveAsModel`, e.target.checked);
                                            }}
                                            label={'Enregistrer ce bloc comme modèle pour une utilisation ultérieur'}
                                            labelPlacement="end"
                                            control={<Checkbox />}
                                        />
                                    </Grid>
                                </Grid>
                                <Box sx={{ paddingLeft: 5 }} minHeight={200}>
                                    <ToggleButtonGroup
                                        orientation="vertical"
                                        value={view}
                                        exclusive
                                        onChange={(e, newValue) => setView(newValue)}
                                        size="small"
                                        sx={{ position: 'absolute', top: 60, left: 0 }}
                                    >
                                        <ToggleButton value="xs" aria-label="XS">
                                            XS
                                        </ToggleButton>

                                        <ToggleButton value="s" aria-label="S">
                                            S
                                        </ToggleButton>

                                        <ToggleButton value="m" aria-label="M">
                                            M
                                        </ToggleButton>

                                        <ToggleButton value="l" aria-label="L">
                                            L
                                        </ToggleButton>

                                        <ToggleButton value="xl" aria-label="XL">
                                            XL
                                        </ToggleButton>
                                    </ToggleButtonGroup>
                                    <Component.PageBlockColumnPart
                                        values={pageBlock}
                                        media={view}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        baseName={`pageBlocks.${index}.`}
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            color="primary"
                            variant="outlined"
                            id="addContentButton"
                            onClick={() => {
                                setDisplayAddModal(true);
                            }}
                        >
                            <AddIcon /> Ajouter un bloc
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                    <DisplayAddPageBlockModal push={push} isOpen={displayAddModal} close={() => setDisplayAddModal(false)} />
                </Box>
            )}
        </FieldArray>
    );
};
