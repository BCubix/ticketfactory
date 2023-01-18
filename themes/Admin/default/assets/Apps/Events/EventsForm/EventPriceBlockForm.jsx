import React, { useState } from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { FormHelperText, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const EventsPriceBlockForm = ({ values, setFieldValue, setFieldTouched, handleBlur, handleChange, touched, errors, initialValues }) => {
    const [deleteMultiple, setDeleteMultiple] = useState(false);

    const handleDeleteMultiple = () => {
        let block = values.eventPriceBlocks;

        if (!block || block.length === 0) {
            block = { name: 'Tarifs', eventPrices: [], lang: initialValues?.lang?.id || '' };
        } else {
            block = block[0];
            block.name = 'Tarifs';
        }

        setFieldValue('eventPriceBlocks', [block]);
        setFieldValue('multiplePriceBlock', false);
    };

    const getBlockError = (index) => {
        const err = getNestedFormikError(touched?.eventPriceBlocks, errors?.eventPriceBlocks, index, 'eventPrices');

        if (typeof err === 'string') {
            return err;
        }

        return '';
    };

    return (
        <>
            <FieldArray name="eventPriceBlocks">
                {({ remove, push }) => (
                    <Box>
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <Component.ActionButton
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (values?.multiplePriceBlock) {
                                        if (values?.eventPriceBlocks?.length > 1) {
                                            setDeleteMultiple(true);
                                        } else {
                                            handleDeleteMultiple();
                                        }
                                    } else {
                                        push({ name: '', eventPrices: [], lang: initialValues?.lang?.id || '' });
                                        setFieldValue('multiplePriceBlock', true);
                                    }
                                }}
                            >
                                <WorkspacesIcon sx={{ marginRight: 1 }} />
                                {values?.multiplePriceBlock ? 'Ne plus utiliser les groupes' : 'Utiliser les groupes'}
                            </Component.ActionButton>

                            {values?.multiplePriceBlock && (
                                <Component.CreateButton
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        push({ name: '', eventPrices: [], lang: initialValues?.lang?.id || '' });
                                    }}
                                    sx={{ ml: 2 }}
                                >
                                    <AddIcon sx={{ marginRight: 1 }} />
                                    Ajouter un groupe
                                </Component.CreateButton>
                            )}
                        </Box>
                        {values?.eventPriceBlocks?.map((item, index) => (
                            <Component.CmtFormBlock title={values?.multiplePriceBlock ? '' : item?.name} marginBlock={7} key={index}>
                                {values?.multiplePriceBlock && (
                                    <Box mb={4}>
                                        <Component.CmtTextField
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            label="Nom"
                                            name={`eventPriceBlocks.${index}.name`}
                                            error={getNestedFormikError(touched?.eventPriceBlocks, errors?.eventPriceBlocks, index, 'name')}
                                        />
                                    </Box>
                                )}
                                <Component.EventsPriceForm
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    touched={touched?.eventPriceBlocks && touched.eventPriceBlocks[index]}
                                    errors={errors?.eventPriceBlocks && errors.eventPriceBlocks[index]}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    blockIndex={index}
                                />

                                {getBlockError(index) && (
                                    <FormHelperText error id={`eventPriceBlocks-${index}-helper-text`}>
                                        {getBlockError(index)}
                                    </FormHelperText>
                                )}

                                {values.multiplePriceBlock && (
                                    <Component.DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Component.DeleteBlockFabButton>
                                )}
                            </Component.CmtFormBlock>
                        ))}
                    </Box>
                )}
            </FieldArray>
            <Component.DeleteDialog
                open={deleteMultiple}
                onCancel={() => setDeleteMultiple(false)}
                onDelete={() => {
                    handleDeleteMultiple();
                    setDeleteMultiple(false);
                }}
            >
                <Box textAlign="center" py={3}>
                    <Typography component="p">Êtes-vous sûr de ne plus vouloir utiliser les groupes ?</Typography>
                    <Typography component="p">Attention, seul le premier groupe ne sera pas supprimé.</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
