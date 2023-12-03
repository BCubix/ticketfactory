import React from 'react';
import { Component } from '@/AdminService/Component';
import { getPropByString } from '@Services/utils/getPropByString';
import moment from 'moment';
import { Box } from '@mui/system';
import { InputLabel } from '@mui/material';
import { CirclePicker } from 'react-color';

const TYPE_INPUT_LIST = {
    text: ({ values, touched, errors, handleBlur, handleChange, ...props }) => (
        <Component.CmtTextField
            {...props}
            value={getPropByString(values, `${props.baseName || ''}value`)}
            error={getPropByString(touched, `${props.baseName || ''}value`) && getPropByString(errors, `${props.baseName || ''}value`)}
            label="Valeur"
            onBlur={handleBlur}
            onChange={handleChange}
            name={`${props.baseName || ''}value`}
            required
        />
    ),

    number: ({ values, touched, errors, handleBlur, handleChange, ...props }) => (
        <Component.CmtTextField
            {...props}
            value={getPropByString(values, `${props.baseName || ''}value`)}
            error={getPropByString(touched, `${props.baseName || ''}value`) && getPropByString(errors, `${props.baseName || ''}value`)}
            label="Valeur"
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            name={`${props.baseName || ''}value`}
            required
        />
    ),

    date: ({ values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched, ...props }) => (
        <Component.CmtDatePicker
            fullWidth
            value={getPropByString(values, `${props.baseName || ''}value`)}
            label={'Valeur'}
            setValue={(newValue) => {
                if (!newValue) {
                    setFieldValue(`${props.baseName || ''}value`, '');
                    return;
                }
                setFieldValue(`${props.baseName || ''}value`, moment(newValue).format('YYYY-MM-DD'));
            }}
            onTouched={setFieldTouched}
            name={`${props.baseName || ''}value`}
            error={getPropByString(touched, `${props.baseName || ''}value`) && getPropByString(errors, `${props.baseName || ''}value`)}
            required
            inputSize="small"
        />
    ),

    color: ({ values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched, disabled, ...props }) => (
        <Box sx={{ marginBlock: 3 }}>
            <InputLabel>Valeur</InputLabel>
            <CirclePicker
                width="100%"
                value={getPropByString(values, `${props.baseName || ''}value`)}
                onChange={(newValue) => {
                    if (disabled) {
                        return;
                    }
                    setFieldValue(`${props.baseName || ''}value`, newValue.hex);
                }}
                error={getPropByString(touched, `${props.baseName || ''}value`) && getPropByString(errors, `${props.baseName || ''}value`)}
                label={'Valeur'}
                onBlur={handleBlur}
                name={`${props.baseName || ''}value`}
                circleSpacing={8}
                required
                disabled={disabled}
            />
            <Component.CmtTextField
                {...props}
                value={getPropByString(values, `${props.baseName || ''}value`)}
                error={getPropByString(touched, `${props.baseName || ''}value`) && getPropByString(errors, `${props.baseName || ''}value`)}
                label="Valeur"
                onBlur={handleBlur}
                onChange={handleChange}
                name={`${props.baseName || ''}value`}
                required
                disabled={disabled}
            />
        </Box>
    ),
};
export const CmtFeaturesTypeValues = ({ values, type, ...props }) => {
    let Cmt = null;

    console.log(type);
    if (!type && !values?.type) {
        Cmt = TYPE_INPUT_LIST['text'];
    } else {
        Cmt = TYPE_INPUT_LIST[type || values?.type];

        if (!Cmt) {
            return <></>;
        }
    }

    return <Cmt values={values} {...props} />;
};
