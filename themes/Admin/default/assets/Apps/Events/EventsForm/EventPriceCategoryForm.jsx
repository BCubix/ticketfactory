import React, { useRef, useState } from 'react';
import { FieldArray } from 'formik';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import WorkspacesIcon from '@mui/icons-material/Workspaces';
import { FormHelperText, Typography } from '@mui/material';
import { Box } from '@mui/system';
import EventIcon from '@mui/icons-material/Event';

import { Component } from '@/AdminService/Component';
import { format, parse } from 'date-fns';
import { getNestedFormikError } from '@Services/utils/getNestedFormikError';
import moment from 'moment';

export const EventsPriceCategoryForm = ({
    dataPath = 'eventPriceCategories',
    selectedDate = null,
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    touched,
    errors,
    initialValues,
    fields,
    defaultPriceCategoryName,
    defaultPrices,
}) => {
    // Helper functions
    const getNestedValue = (path, object) => {
        return path.split('.').reduce((acc, key) => acc?.[key], object);
    };

    const getBlockError = (index) => {
        const err = getNestedFormikError(getNestedValue(dataPath, touched), getNestedValue(dataPath, errors), index, 'eventPrices');
        if (typeof err === 'string') {
            return err;
        }

        return '';
    };

    // End of helper functions

    const [deleteMultiple, setDeleteMultiple] = useState(false);
    const blockIndex = useRef(getNestedValue(dataPath, values)?.length || 0);
    const eventPriceCategories = getNestedValue(dataPath, values) || [];

    const handleDeleteMultiple = () => {
        let block = getNestedValue(dataPath, values) || [];

        if (!block || block.length === 0) {
            block = { name: defaultPriceCategoryName || 'Tarifs', eventPrices: defaultPrices || [], lang: initialValues?.lang?.id || '' };
        } else {
            block = block[0];
            block.name = defaultPriceCategoryName || 'Tarifs';
        }

        setFieldValue(dataPath, [block]);
        setFieldValue('multiplePriceCategory', false);
    };

    return (
        <>
            <FieldArray name={dataPath}>
                {({ remove, push }) => (
                    <Box>
                        <Box className="block-head">
                            <Component.ActionButton
                                size="small"
                                color="primary"
                                variant="contained"
                                onClick={() => {
                                    if (values?.multiplePriceCategory) {
                                        if (eventPriceCategories?.length > 1) {
                                            setDeleteMultiple(true);
                                        } else {
                                            handleDeleteMultiple();
                                        }
                                    } else {
                                        push({ name: '', eventPrices: [], eventDate: selectedDate || '', lang: initialValues?.lang?.id || '' });
                                        setFieldValue('multiplePriceCategory', true);
                                    }
                                }}
                            >
                                <WorkspacesIcon sx={{ marginRight: 1 }} />
                                {values?.multiplePriceCategory ? 'Ne plus utiliser les groupes' : 'Utiliser les groupes'}
                            </Component.ActionButton>

                            {values?.multiplePriceCategory && (
                                <Component.CreateButton
                                    size="small"
                                    color="primary"
                                    variant="contained"
                                    onClick={() => {
                                        push({ name: '', eventPrices: [], lang: initialValues?.lang?.id || '', index: blockIndex.current });
                                        blockIndex.current = blockIndex.current + 1;
                                    }}
                                    sx={{ ml: 2 }}
                                >
                                    <AddIcon sx={{ marginRight: 1 }} />
                                    Ajouter un groupe
                                </Component.CreateButton>
                            )}
                        </Box>
                        {eventPriceCategories?.map((item, index) => {
                            if (selectedDate !== null && item.eventDate?.eventDate !== selectedDate?.eventDate) {
                                return null;
                            }

                            return (
                                <Component.CmtFormBlock title={values?.multiplePriceCategory ? '' : item?.name} marginBlock={7} key={index}>
                                    {values?.multiplePriceCategory && (
                                        <Box className="block-title">
                                            <Component.CmtTextField
                                                value={item.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                                label="Nom"
                                                name={`${dataPath}.${index}.name`}
                                                error={getNestedFormikError(touched?.eventPriceCategories, errors?.eventPriceCategories, index, 'name')}
                                            />
                                        </Box>
                                    )}
                                    <Component.EventsPriceForm
                                        dataPath={dataPath}
                                        values={values}
                                        setFieldValue={setFieldValue}
                                        setFieldTouched={setFieldTouched}
                                        touched={touched?.eventPriceCategories && touched.eventPriceCategories[index]}
                                        errors={errors?.eventPriceCategories && errors.eventPriceCategories[index]}
                                        handleBlur={handleBlur}
                                        handleChange={handleChange}
                                        blockIndex={index}
                                        fields={fields}
                                    />

                                    {item?.eventDate && item?.eventDate !== '' && selectedDate === null && (
                                        <Box className="block-notification">
                                            <EventIcon className="block-notification__icon" />

                                            <Typography>{moment(item.eventDate.eventDate).format('d/MM/yyyy HH:mm')}</Typography>
                                        </Box>
                                    )}

                                    {getBlockError(index) && (
                                        <FormHelperText error id={`${dataPath}-${index}-helper-text`}>
                                            {getBlockError(index)}
                                        </FormHelperText>
                                    )}

                                    {values.multiplePriceCategory && (
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
                            );
                        })}
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
                <Box className="block-delete">
                    <Typography component="p">Êtes-vous sûr de ne plus vouloir utiliser les groupes ?</Typography>
                    <Typography component="p">Attention, seul le premier groupe ne sera pas supprimé.</Typography>

                    <Typography component="p">Cette action est irréversible.</Typography>
                </Box>
            </Component.DeleteDialog>
        </>
    );
};
