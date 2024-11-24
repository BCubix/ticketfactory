import React, { useEffect, useMemo, useState } from 'react';
import { FieldArray } from 'formik';
import { useDispatch } from 'react-redux';
import { Card, CardContent, Checkbox, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, InputLabel, Tab, Tabs, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Box } from '@mui/system';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';

import { GetPageBlockColumn } from '@Apps/PageBlocks/CreatePageBlock/CreatePageBlockFormat';

import { Constant } from '@/AdminService/Constant';
import { Api } from '@/AdminService/Api';
import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const NEW_BLOCK_DATA = {
    name: '',
    saveAsModel: false,
    formatIndex: 0,
    pageBlock: null,
    selectedBlock: 0,
    pageBlockType: '',
};

const DisplayAddPageBlockModal = ({ push, isOpen, close, initValues, pageBlockTypesList, formCrud, ...rest }) => {
    const dispatch = useDispatch();
    const [newBlockMode, setNewBlockMode] = useState('create');
    const [newBlockData, setNewBlockData] = useState(NEW_BLOCK_DATA);
    const [pageBlocks, setPageBlocks] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.pageBlocksApi.getAllPageBlocks();
            if (result?.result) {
                setPageBlocks(result.pageBlocks);
            }
        });
    }, []);

    const handleCreate = () => {
        const columns = [];
        if (!newBlockData.pageBlockType) {
            Constant.PAGE_BLOCKS_FORMATS[newBlockData.formatIndex].forEach((value) => {
                columns.push(GetPageBlockColumn(value));
            });
        }

        let fields = {};
        if (newBlockData.pageBlockType) {
            pageBlockTypesList
                ?.find((item) => item.id === newBlockData.pageBlockType)
                .fields.forEach((el) => {
                    if (formCrud.contentFields[el.type]?.getInitialValue) {
                        fields[el.name] = formCrud.contentFields[el.type]?.getInitialValue(el, formCrud.contentFields) || '';
                    } else {
                        fields[el.name] = '';
                    }
                });
        }

        push({
            name: newBlockData.name,
            saveAsModel: newBlockData.saveAsModel,
            pageBlockType: newBlockData.pageBlockType,
            columns: columns,
            fields,
            lang: initValues?.lang?.id || '',
            languageGroup: '',
        });
        resetChoice();
        close();
    };

    const handleImport = () => {
        const pageBlock = pageBlocks[newBlockData.selectedBlock];

        if (!pageBlock) {
            return;
        }

        push({
            name: pageBlock.name,
            saveAsModel: false,
            columns: [...pageBlock.columns],
            fields: pageBlock.fields || {},
            pageBlockType: pageBlock.pageBlockType.id || '',
            lang: pageBlock.lang?.id || '',
            languageGroup: '',
        });
        resetChoice();
        close();
    };

    const resetChoice = () => {
        setNewBlockData(NEW_BLOCK_DATA);
    };

    return (
        <Dialog open={isOpen} onClose={close} fullWidth maxWidth="lg">
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

            <DialogContent sx={{ minHeight: 400 }}>
                {newBlockMode === 'create' && (
                    <Component.CreatePageBlockFormat
                        newBlockData={newBlockData}
                        setNewBlockData={setNewBlockData}
                        displaySave={true}
                        pageBlockTypesList={pageBlockTypesList}
                        formCrud={formCrud}
                        {...rest}
                    />
                )}
                {newBlockMode === 'import' && (
                    <Component.ImportPageBlock
                        pageBlocks={pageBlocks}
                        selectedBlock={newBlockData.selectedBlock}
                        setSelectedBlock={(newValue) => setNewBlockData({ ...newBlockData, selectedBlock: newValue })}
                    />
                )}
            </DialogContent>

            <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                {newBlockMode === 'create' ? (
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

export const PagesBlocksPart = ({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur, initValues, pageColumnTypeModules, formCrud, ...rest }) => {
    const [displayAddModal, setDisplayAddModal] = useState(false);
    const [view, setView] = useState('xl');
    const [showClass, setShowClass] = useState(false);

    const contentModules = useMemo(() => {
        return formCrud.contentFields;
    }, []);

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

                                <Grid container spacing={4} className={`${!pageBlock?.pageBlockType ? 'padding-left-5' : ''}`}>
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

                                    <Grid item xs={12} sm={5} display="flex" alignItems="center" gap={2}>
                                        <Component.CmtTextField
                                            value={pageBlock.class}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            label="Classe du bloc"
                                            name={`pageBlocks.${index}.class`}
                                            sx={{
                                                display: showClass ? 'inline-flex' : 'none',
                                            }}
                                        />
                                        <Component.EditFabButton
                                            size="small"
                                            id={`pageBlocks-${index}-more`}
                                            sx={{ height: 30, width: 30, minHeight: 0, minWidth: 0, marginLeft: 'auto' }}
                                            onClick={() => {
                                                setShowClass(!showClass);
                                            }}
                                        >
                                            <SettingsIcon />
                                        </Component.EditFabButton>
                                    </Grid>

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
                                </Grid>

                                <Box className={`${!pageBlock?.pageBlockType ? 'padding-left-5' : ''}`} minHeight={200}>
                                    {!pageBlock?.pageBlockType && (
                                        <ToggleButtonGroup
                                            orientation="vertical"
                                            value={view}
                                            exclusive
                                            onChange={(e, newValue) => newValue && setView(newValue)}
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
                                    )}

                                    {pageBlock.pageBlockType ? (
                                        <Component.PageBlockContentPart
                                            values={pageBlock}
                                            errors={errors}
                                            touched={touched}
                                            media={view}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            handleChange={handleChange}
                                            handleBlur={handleBlur}
                                            prefixName={`pageBlocks.${index}.fields.`}
                                            pageColumnTypeModules={pageColumnTypeModules}
                                            formCrud={formCrud}
                                            contentModules={contentModules}
                                            {...rest}
                                        />
                                    ) : (
                                        <Component.PageBlockColumnPart
                                            values={pageBlock}
                                            errors={errors}
                                            touched={touched}
                                            media={view}
                                            setFieldValue={setFieldValue}
                                            setFieldTouched={setFieldTouched}
                                            baseName={`pageBlocks.${index}.`}
                                            pageColumnTypeModules={pageColumnTypeModules}
                                            formCrud={formCrud}
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
                    <DisplayAddPageBlockModal push={push} isOpen={displayAddModal} close={() => setDisplayAddModal(false)} initValues={initValues} formCrud={formCrud} {...rest} />
                </Box>
            )}
        </FieldArray>
    );
};
