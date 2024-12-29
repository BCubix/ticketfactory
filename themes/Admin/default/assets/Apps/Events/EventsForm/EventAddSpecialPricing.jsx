import React, { useState, useMemo } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

import { EventsPriceCategoryForm } from './EventPriceCategoryForm';
import { eventsPriceFormFields } from './EventsPriceForm';

function EventAddSpecialPricing({
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
  ...props
}) {
  const getNumberExistingCategories = (selectedDate) => {
    const matchingCategories = values?.eventPriceCategories?.filter(
      (category) => category.eventDate === selectedDate
    );

    const totalEventPrices = matchingCategories?.reduce(
      (total, category) => total + (category.eventPrices?.length || 0),
      0
    );

    return totalEventPrices || 0;
  };

  // Use useMemo to optimize calculation
  const numberOfCategories = useMemo(
    () => getNumberExistingCategories(selectedDate),
    [values, selectedDate]
  );

  const duplicateValue = () => {
    const isDateAlreadyPresent = values?.eventPriceCategories?.some(
      (category) => category.eventDate === selectedDate
    );

    // If a matching date exists, exit early
    if (isDateAlreadyPresent) {
      return;
    }

    const eventPriceCategoriesWithoutEventDate = values?.eventPriceCategories?.filter(
      (category) => category.eventDate === ""
    );

    const filteredEventPriceCategories = eventPriceCategoriesWithoutEventDate?.map((category) => ({
      eventDate: selectedDate,
      name: category?.name,
      lang: category?.lang?.id || category?.lang,
      eventPrices: category?.eventPrices?.map((price) => ({
        name: price?.name,
        annotation: price?.annotation,
        price: price?.price,
        index: price?.index,
      })),
    }));
    
    setFieldValue(
      'eventPriceCategories',
      [...(values?.eventPriceCategories ||  [{ name: defaultPriceCategoryName || 'Tarifs', eventPrices: defaultPrices || [], lang: initValues?.lang?.id || '' }]), ...filteredEventPriceCategories]);
  };

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    duplicateValue();
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = () => {
    // Remove the eventPriceCategories associated with the selectedDate
    const updatedCategories = values?.eventPriceCategories?.filter(
      (category) => category.eventDate !== selectedDate
    );

    // Update the field with the filtered categories
    setFieldValue('eventPriceCategories', updatedCategories);

    // Close the dialog
    setOpen(false);
  };

  return (
    <div>

      <Button size="small" color="primary" onClick={handleClickOpen}>
        {`${numberOfCategories} ${numberOfCategories === 1 ? "Tarif spécial" : "Tarifs spéciaux"}`}
      </Button>

      {/* Dialog component */}
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
      </div>
  );
}

export default EventAddSpecialPricing;
