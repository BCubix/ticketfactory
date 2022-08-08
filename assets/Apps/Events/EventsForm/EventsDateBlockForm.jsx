import { Box } from '@mui/system';
import { FieldArray } from 'formik';
import React from 'react';
import { EventsDateForm } from './EventsDateForm';

export const EventsDateBlockForm = ({
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    touched,
    errors,
}) => {
    return (
        <FieldArray name="eventDateBlocks">
            {({ remove, push }) => (
                <Box>
                    {values?.eventDateBlocks?.map((_, index) => (
                        <EventsDateForm
                            values={values}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            touched={touched}
                            errors={errors}
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
