import React, { useState } from 'react';
import { FieldArray } from 'formik';
import moment from 'moment';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { FormHelperText, Typography } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

export const EventsDateBlockForm = ({ values, setFieldValue, setFieldTouched, handleBlur, handleChange, touched, errors, initialValues }) => {
    const [deleteMultiple, setDeleteMultiple] = useState(false);
    const [generateDate, setGenerateDate] = useState(null);

    const handleDeleteMultiple = () => {
        let block = values.eventDateBlocks;

        if (!block || block.length === 0) {
            block = { name: 'Dates', eventDates: [], lang: initialValues?.lang?.id || '' };
        } else {
            block = block[0];
            block.name = 'Dates';
        }

        setFieldValue('eventDateBlocks', [block]);
        setFieldValue('multipleDateBlock', false);
    };

    const getBlockError = (index) => {
        const err = getNestedFormikError(touched?.eventDateBlocks, errors?.eventDateBlocks, index, 'eventDates');

        if (typeof err === 'string') {
            return err;
        }

        return '';
    };

    return (
        <>
            <FieldArray name="eventDateBlocks">
                {({ remove, push }) => (
                    <Box>
                        <Box pt={2} pl={4} display="flex" justifyContent={'flex-end'}>
                            <Component.ActionButton
                                size="small"
                                color="primary"
                                variant="contained"
                                id="useEventDateGroup"
                                onClick={() => {
                                    if (values?.multipleDateBlock) {
                                        if (values?.eventDateBlocks?.length > 1) {
                                            setDeleteMultiple(true);
                                        } else {
                                            handleDeleteMultiple();
                                        }
                                    } else {
                                        push({ name: '', eventDates: [], lang: initialValues?.lang?.id || '' });
                                        setFieldValue('multipleDateBlock', true);
                                    }
                                }}
                            >
                                <WorkspacesIcon sx={{ marginRight: 1 }} />
                                {values?.multipleDateBlock ? 'Ne plus utiliser les groupes' : 'Utiliser les groupes'}
                            </Component.ActionButton>

                            {values?.multipleDateBlock && (
                                <Component.CreateButton
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        push({ name: '', eventDates: [], lang: initialValues?.lang?.id || '' });
                                    }}
                                    sx={{ ml: 2 }}
                                >
                                    <AddIcon sx={{ marginRight: 1 }} />
                                    Ajouter un groupe
                                </Component.CreateButton>
                            )}
                        </Box>
                        {values?.eventDateBlocks?.map((item, index) => (
                            <Component.CmtFormBlock marginBlock={7} title={values?.multipleDateBlock ? '' : item?.name} key={index}>
                                {values?.multipleDateBlock && (
                                    <Box mb={4}>
                                        <Component.CmtTextField
                                            value={item.name}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            required
                                            label="Nom"
                                            name={`eventDateBlocks.${index}.name`}
                                            error={getNestedFormikError(touched?.eventDateBlocks, errors?.eventDateBlocks, index, 'name')}
                                        />
                                    </Box>
                                )}
                                <Component.EventsDateForm
                                    values={values}
                                    setFieldValue={setFieldValue}
                                    setFieldTouched={setFieldTouched}
                                    touched={touched}
                                    errors={errors}
                                    handleBlur={handleBlur}
                                    handleChange={handleChange}
                                    key={index}
                                    blockIndex={index}
                                    setGenerateDate={setGenerateDate}
                                />

                                {getBlockError(index) && (
                                    <FormHelperText error id={`eventDateBlocks-${index}-helper-text`}>
                                        {getBlockError(index)}
                                    </FormHelperText>
                                )}

                                {values.multipleDateBlock && (
                                    <Component.DeleteBlockFabButton
                                        size="small"
                                        id={`removeEventDateBlock-${index}`}
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
            {errors?.eventDateBlocks && typeof errors?.eventDateBlocks === 'string' && (
                <FormHelperText error id="eventDateBlocks-helper-text">
                    {errors.eventDateBlocks}
                </FormHelperText>
            )}
            <Component.EventDateRange
                open={generateDate}
                setOpen={setGenerateDate}
                submitDateRange={(newDates) => {
                    let dates = values.eventDateBlocks[generateDate]?.eventDates;
                    dates = [...dates, ...newDates];

                    dates.sort((a, b) => moment(a.eventDate).diff(b.eventDate));

                    setFieldValue(`eventDateBlocks.${generateDate}.eventDates`, [...dates]);
                }}
            />
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
