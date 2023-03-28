import React, { useEffect, useState } from 'react';
import { FieldArray } from 'formik';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, InputLabel, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box } from '@mui/system';

import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';

import { GetPageBlockColumn } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlockFormat';

import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

const CreateSlider = ({ name, setName }) => {
    return (
        <Box display="flex" flexDirection={'column'}>
            <Component.CmtTextField value={name} onChange={(event) => setName(event.target.value)} label="Nom du bloc" />
        </Box>
    );
};

const DisplayAddPageBlockModal = ({ push, isOpen, close, initValues }) => {
    const dispatch = useDispatch();

    const [newBlockMode, setNewBlockMode] = useState('create');

    const [name, setName] = useState('');
    const [saveAsModel, setSaveAsModel] = useState(false);
    const [formatIndex, setFormatIndex] = useState(0);

    const [pageBlocks, setPageBlocks] = useState(null);
    const [selectedBlock, setSelectedBlock] = useState(0);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.getAllPageBlocks();
            if (result?.result) {
                setPageBlocks(result?.pageBlocks);
            }
        });
    }, []);

    const handleCreate = () => {
        const columns = [];
        Constant.PAGE_BLOCKS_FORMATS[formatIndex].forEach((value) => {
            columns.push(GetPageBlockColumn(value));
        });

        push({
            name: name,
            saveAsModel: saveAsModel,
            columns: columns,
            blockType: 0,
            titleDisplayed: false,
            lang: initValues?.lang?.id || '',
            languageGroup: '',
        });
        resetChoice();
        close();
    };

    const handleCreateSlider = () => {
        const columns = [GetPageBlockColumn(12)];

        push({
            name: name,
            saveAsModel: false,
            columns: columns,
            blockType: 1,
            titleDisplayed: false,
            lang: initValues?.lang?.id || '',
            languageGroup: '',
        });
        resetChoice();
        close();
    };

    const handleImport = () => {
        const pageBlock = pageBlocks[selectedBlock];

        if (!pageBlock) {
            return;
        }

        push({ name: pageBlock.name, saveAsModel: false, columns: [...pageBlock.columns], lang: pageBlock.lang?.id || '', languageGroup: pageBlock?.languageGroup || '' });
        resetChoice();
        close();
    };

    const resetChoice = () => {
        setSelectedBlock(0);
        setName('');
        setSaveAsModel(false);
        setFormatIndex(0);
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
                <Tab label="Créer un nouveau bloc (Slider)" value="slider" />
            </Tabs>

            <DialogContent sx={{ minHeight: 300 }}>
                {newBlockMode === 'create' && (
                    <Component.CreatePageBlockFormat
                        name={name}
                        setName={setName}
                        formatIndex={formatIndex}
                        setFormatIndex={setFormatIndex}
                        displaySave={true}
                        saveAsModel={saveAsModel}
                        setSaveAsModel={setSaveAsModel}
                    />
                )}
                {newBlockMode === 'import' && <Component.ImportPageBlock pageBlocks={pageBlocks} selectedBlock={selectedBlock} setSelectedBlock={setSelectedBlock} />}
                {newBlockMode === 'slider' && <CreateSlider name={name} setName={setName} />}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {newBlockMode === 'create' || newBlockMode === 'slider' ? (
                    <Component.CreateButton id="createBlockSubmit" variant="contained" onClick={newBlockMode === 'create' ? handleCreate : handleCreateSlider}>
                        Créer
                    </Component.CreateButton>
                ) : (
                    <Component.CreateButton id="importBlockSubmit" variant="contained" onClick={handleImport} disabled={newBlockMode === 'import' && !pageBlocks}>
                        Importer
                    </Component.CreateButton>
                )}
            </DialogActions>
        </Dialog>
    );
};

export const PagesBlocksPart = ({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur, initValues }) => {
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [view, setView] = useState('xl');

    const handleMoveMenuElement = (index, move) => {
        let newList = values.pageBlocks;
        let elem = values.pageBlocks[index];

        newList.splice(index, 1);
        newList.splice(index + move, 0, elem);

        setFieldValue('pageBlocks', newList);
    };

    return (
        <FieldArray name="pageBlocks">
            {({ remove, push }) => (
                <Box sx={{ width: '100%', marginTop: 2, paddingInline: 1 }}>
                    {values.pageBlocks?.map((pageBlock, index) => (
                        <Card key={index} sx={{ position: 'relative', overflow: 'visible', marginBottom: 7 }}>
                            <CardContent>
                                <InputLabel>Bloc n°{index + 1}</InputLabel>

                                <Box sx={{ position: 'absolute', right: 20, top: 20 }}>
                                    {index < values.pageBlocks.length - 1 && (
                                        <Component.MoveElementButton onClick={() => handleMoveMenuElement(index, 1)} title="Descendre d'un cran">
                                            <ArrowDownwardIcon fontSize="inherit" />
                                        </Component.MoveElementButton>
                                    )}

                                    {index > 0 && (
                                        <Component.MoveElementButton onClick={() => handleMoveMenuElement(index, -1)} title="Monter d'un cran">
                                            <ArrowUpwardIcon fontSize="inherit" />
                                        </Component.MoveElementButton>
                                    )}
                                </Box>

                                <Grid container spacing={4} sx={{ paddingLeft: 15 }}>
                                    <Grid item xs={12} sm={7} sx={{ display: 'flex', alignItems: 'center' }}>
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

                                    {pageBlock?.blockType === 0 && (
                                        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center' }}>
                                            <FormControlLabel
                                                size="small"
                                                value={pageBlock.saveAsModel}
                                                onChange={(e) => {
                                                    setFieldValue(`pageBlocks.${index}.saveAsModel`, e.target.checked);
                                                }}
                                                label={'Enregistrer ce bloc comme modèle pour une utilisation ultérieure'}
                                                labelPlacement="end"
                                                control={<Checkbox checked={Boolean(pageBlock.saveAsModel)} />}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                                <Box sx={{ paddingLeft: 5 }} minHeight={200}>
                                    {pageBlock?.blockType === 0 && (
                                        <>
                                            <ToggleButtonGroup
                                                orientation="vertical"
                                                value={view}
                                                exclusive
                                                onChange={(e, newValue) => setView(newValue)}
                                                size="small"
                                                sx={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 0 }}
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
                                        </>
                                    )}

                                    {pageBlock?.blockType === 1 && (
                                        <Component.PagesBlocksSliderPart
                                            values={pageBlock}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            baseName={`pageBlocks.${index}.`}
                                            errors={errors?.pageBlocks}
                                            touched={touched?.pageBlocks?.at(index)}
                                        />
                                    )}

                                    <Component.DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Component.DeleteBlockFabButton>
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
                    <DisplayAddPageBlockModal push={push} isOpen={displayAddModal} close={() => setDisplayAddModal(false)} initValues={initValues} />
                </Box>
            )}
        </FieldArray>
    );
};
