import React from 'react';
import { Component } from '@/AdminService/Component';
import { FormControlLabel, Grid, Switch } from '@mui/material';

const TypeObj = {
    textField: ({ values, touched, errors, handleBlur, handleChange, ...props }) => (
        <Component.CmtTextField value={values[props.name]} error={touched[props.name] && errors[props.name]} onBlur={handleBlur} onChange={handleChange} {...props} />
    ),
    slugInput: (props) => <Component.CmtSlugInput {...props} />,
    editorField: ({ values, touched, errors, setFieldValue, setFieldTouched, ...props }) => (
        <Component.CmtEditorField
            value={values[props.name]}
            errors={touched[props.name] && errors[props.name]}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            {...props}
        />
    ),
    selectField: ({ listName, values, touched, errors, setFieldValue, ...props }) => (
        <Component.CmtSelectField
            value={values[props.name]}
            errors={touched[props.name] && errors[props.name]}
            list={props[listName] ? props[listName] : []}
            setFieldValue={setFieldValue}
            {...props}
        />
    ),
    switch: ({ name, values, handleChange, label, labelPlacement, setFieldValue }) => (
        <FormControlLabel
            control={
                <Switch
                    checked={Boolean(values[name])}
                    onChange={
                        handleChange
                            ? handleChange
                            : (e) => {
                                  setFieldValue(name, e.target.checked);
                              }
                    }
                    name={name}
                />
            }
            label={label}
            labelPlacement={labelPlacement ? labelPlacement : 'start'}
        />
    ),
};

export const CmtDisplayFields = ({ fields, ...inheritedProps }) => {
    return (
        <>
            {fields.map((field, index) => {
                const { style, input, inputs, component: Cmt } = field;
                const items = input ? [typeof input === 'function' ? input(inheritedProps) : input] : inputs;

                return (
                    <Grid item key={index} {...style}>
                        {Cmt ? (
                            <Cmt {...inheritedProps} />
                        ) : (
                            items?.map((item, index) => {
                                const { inputType, custom, ...inputProps } = item;
                                const CmtInput = TypeObj[inputType];

                                if (!CmtInput) {
                                    return <React.Fragment key={index} />;
                                }

                                const customProps = custom ? Object.fromEntries(Object.entries(custom).map(([key, func]) => [key, func(inheritedProps)])) : null;

                                return <CmtInput key={index} {...inheritedProps} {...inputProps} {...customProps} />;
                            })
                        )}
                    </Grid>
                );
            })}
        </>
    );
};
