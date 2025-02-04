import React, { useState, useMemo, useCallback } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { EventsPriceCategoryForm } from './EventPriceCategoryForm';
import { eventsPriceFormFields } from './EventsPriceForm';

function EventAddSpecialPricing({
    dataPath = 'eventPriceCategories',
    open = false,
    selectedDate = null,
    handleClose,
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
    initValues,
    ...props
}) {
    const handleDelete = useCallback(() => {
        // Remove the eventPriceCategories associated with the selectedDate
        const updatedCategories = values?.eventPriceCategories?.filter((category) => category.eventDate !== selectedDate);

        // Update the field with the filtered categories
        setFieldValue('eventPriceCategories', updatedCategories);

        // Close the dialog
        handleClose();
    }, [values, selectedDate, setFieldValue]);

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
            sx={{
                '& .MuiDialog-paper': {
                    width: '80%',
                    height: '80%',
                    maxHeight: '90%',
                    borderRadius: '12px',
                },
            }}
        >
            <DialogTitle>Tarifs spéciaux</DialogTitle>
            <DialogContent>
                <EventsPriceCategoryForm
                    dataPath={dataPath}
                    selectedDate={selectedDate}
                    values={values}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    touched={touched}
                    errors={errors}
                    initialValues={initialValues}
                    fields={eventsPriceFormFields.fields}
                    defaultPriceCategoryName={defaultPriceCategoryName}
                    defaultPrices={defaultPrices}
                    {...props}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDelete} color="error">
                    Supprimer
                </Button>

                <Button onClick={handleClose} color="primary">
                    Fermer
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EventAddSpecialPricing;
