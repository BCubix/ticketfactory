import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { EventsPriceForm } from './EventsPriceForm';

export const EventsPriceBlockForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    touched,
    errors,
}) => {
    return (
        <FieldArray name="eventPriceBlocks">
            {({ remove, push }) => (
                <Box>
                    {values?.eventPriceBlocks?.map((_, index) => (
                        <EventsPriceForm
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            touched={touched?.eventPriceBlocks && touched.eventPriceBlocks[index]}
                            errors={errors?.eventPriceBlocks && errors.eventPriceBlocks[index]}
                            handleBlur={handleBlur}
                            handleChange={handleChange}
                            key={index}
                            blockIndex={index}
                        />
                    ))}
                </Box>
            )}
        </FieldArray>
    );
};
