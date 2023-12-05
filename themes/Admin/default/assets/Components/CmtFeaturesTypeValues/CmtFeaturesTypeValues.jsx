import React from 'react';
import { Component } from '@/AdminService/Component';
import { getPropByString } from '@Services/utils/getPropByString';
import moment from 'moment';
import { Box } from '@mui/system';
import { InputLabel } from '@mui/material';
import { CirclePicker } from 'react-color';

const TYPE_INPUT_LIST = {
    text: ({ values, touched, errors, handleBlur, handleChange, required, label = 'Valeur', ...props }) => (
        <>
            <Component.CmtTextField
                {...props}
                value={getPropByString(values, `${props.baseName || ''}${props.name}`)}
                error={getPropByString(touched, `${props.baseName || ''}${props.name}`) && getPropByString(errors, `${props.baseName || ''}${props.name}`)}
                label={label}
                onBlur={handleBlur}
                onChange={handleChange}
                name={`${props.baseName || ''}${props.name}`}
                required={required}
            />
        </>
    ),

    number: ({ values, touched, errors, handleBlur, handleChange, required, label = 'Valeur', ...props }) => (
        <Component.CmtTextField
            {...props}
            value={getPropByString(values, `${props.baseName || ''}${props.name}`)}
            error={getPropByString(touched, `${props.baseName || ''}${props.name}`) && getPropByString(errors, `${props.baseName || ''}${props.name}`)}
            label={label}
            type="number"
            onBlur={handleBlur}
            onChange={handleChange}
            name={`${props.baseName || ''}${props.name}`}
            required={required}
        />
    ),

    date: ({ values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched, required, label = 'Valeur', ...props }) => (
        <Component.CmtDatePicker
            fullWidth
            value={getPropByString(values, `${props.baseName || ''}${props.name}`)}
            label={label}
            setValue={(newValue) => {
                if (!newValue) {
                    setFieldValue(`${props.baseName || ''}${props.name}`, '');
                    return;
                }
                setFieldValue(`${props.baseName || ''}${props.name}`, moment(newValue).format('YYYY-MM-DD'));
            }}
            onTouched={setFieldTouched}
            name={`${props.baseName || ''}${props.name}`}
            error={getPropByString(touched, `${props.baseName || ''}${props.name}`) && getPropByString(errors, `${props.baseName || ''}${props.name}`)}
            required={required}
            inputSize="small"
        />
    ),

    color: ({ values, touched, errors, handleBlur, handleChange, setFieldValue, setFieldTouched, disabled, required, label = 'Valeur', ...props }) => (
        <Box sx={{ marginBlock: 3 }}>
            <InputLabel>Valeur</InputLabel>
            <CirclePicker
                width="100%"
                value={getPropByString(values, `${props.baseName || ''}${props.name}`)}
                onChange={(newValue) => {
                    if (disabled) {
                        return;
                    }
                    setFieldValue(`${props.baseName || ''}${props.name}`, newValue.hex);
                }}
                error={getPropByString(touched, `${props.baseName || ''}${props.name}`) && getPropByString(errors, `${props.baseName || ''}${props.name}`)}
                label={label}
                onBlur={handleBlur}
                name={`${props.baseName || ''}${props.name}`}
                circleSpacing={8}
                required={required}
                disabled={disabled}
            />
            <Component.CmtTextField
                {...props}
                value={getPropByString(values, `${props.baseName || ''}${props.name}`)}
                error={getPropByString(touched, `${props.baseName || ''}${props.name}`) && getPropByString(errors, `${props.baseName || ''}${props.name}`)}
                label={label}
                onBlur={handleBlur}
                onChange={handleChange}
                name={`${props.baseName || ''}${props.name}`}
                required={required}
                disabled={disabled}
            />
        </Box>
    ),
};
export const CmtFeaturesTypeValues = ({ values, type, ...props }) => {
    let Cmt = null;

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
