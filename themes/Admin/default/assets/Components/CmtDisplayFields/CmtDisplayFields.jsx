import React from 'react';
import { Component } from '@/AdminService/Component';
import { Checkbox, FormControlLabel, Grid, Switch } from '@mui/material';
import { FieldArray } from 'formik';
import { getPropByString } from '@Services/utils/getPropByString';

import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system';
import moment from 'moment/moment';

const TypeObj = {
    textField: ({ values, touched, errors, handleBlur, handleChange, ...props }) => (
        <>
            <Component.CmtTextField
                {...props}
                value={getPropByString(values, `${props.baseName || ''}${getName(props)}`)}
                error={getPropByString(touched, `${props.baseName || ''}${getName(props)}`) && getPropByString(errors, `${props.baseName || ''}${getName(props)}`)}
                onBlur={handleBlur}
                onChange={handleChange}
                name={`${props.baseName || ''}${getName(props)}`}
            />
        </>
    ),
    slugInput: (props) => <Component.CmtSlugInput {...props} name={`${props.baseName || ''}${getName(props)}`} />,
    date: ({ values, touched, errors, setFieldValue, setFieldTouched, ...props }) => (
        <Component.CmtDatePicker
            fullWidth
            {...props}
            value={getPropByString(values, `${props.baseName || ''}${getName(props)}`)}
            setValue={(newValue) => {
                setFieldValue(`${props.baseName || ''}${getName(props)}`, newValue ? moment(newValue).format('YYYY-MM-DD') : '');
            }}
            onTouched={setFieldTouched}
            name={`${props.baseName || ''}${getName(props)}`}
            error={getPropByString(touched, `${props.baseName || ''}${getName(props)}`) && getPropByString(errors, `${props.baseName || ''}${getName(props)}`)}
        />
    ),
    editorField: ({ values, touched, errors, setFieldValue, setFieldTouched, ...props }) => (
        <Component.CmtEditorField
            {...props}
            value={values[getName(props)]}
            errors={touched[getName(props)] && errors[getName(props)]}
            setFieldValue={setFieldValue}
            setFieldTouched={setFieldTouched}
            name={`${props.baseName || ''}${getName(props)}`}
        />
    ),
    selectField: ({ listName, values, touched, errors, setFieldValue, ...props }) => (
        <Component.CmtSelectField
            {...props}
            value={values[getName(props)]}
            errors={touched[getName(props)] && errors[getName(props)]}
            list={props[listName] ? props[listName] : []}
            name={`${props.baseName || ''}${getName(props)}`}
            setFieldValue={setFieldValue}
        />
    ),
    cmtImage: ({ values, setFieldValue, touched, errors, ...props }) => (
        <>
            <Component.CmtImage
                {...props}
                name={`${props.baseName || ''}${getName(props)}`}
                image={getPropByString(values, `${props.baseName || ''}${getName(props)}`)}
                setFieldValue={setFieldValue}
                touched={getPropByString(touched, `${props.baseName || ''}${getName(props)}`)}
                errors={getPropByString(errors, `${props.baseName || ''}${getName(props)}`)}
            />
        </>
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
                                  setFieldValue(`${props.baseName || ''}${getName(name)}`, e.target.checked);
                              }
                    }
                    name={name}
                />
            }
            label={label}
            labelPlacement={labelPlacement ? labelPlacement : 'start'}
        />
    ),
    checkbox: ({ name, values, handleChange, label, labelPlacement, setFieldValue }) => (
        <FormControlLabel
            control={
                <Checkbox
                    checked={Boolean(values[name])}
                    onChange={
                        handleChange
                            ? handleChange
                            : (e) => {
                                  setFieldValue(`${props.baseName || ''}${getName(name)}`, e.target.checked);
                              }
                    }
                    name={name}
                />
            }
            label={label}
            labelPlacement={labelPlacement ? labelPlacement : 'start'}
        />
    ),
    fieldArray: ({ values, label, ...props }) => (
        <FieldArray name={`${props.baseName || ''}${getName(props)}`}>
            {({ remove, push }) => (
                <>
                    {values &&
                        getPropByString(values, `${props.baseName || ''}${getName(props)}`)?.map((item, index) => (
                            <Component.CmtFormBlock title={`${label} N° ${index + 1}`}>
                                <Box position="relative" key={index}>
                                    <Component.DeleteBlockFabButton
                                        size="small"
                                        onClick={() => {
                                            remove(index);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Component.DeleteBlockFabButton>

                                    <Component.CmtDisplayFields {...props} values={values} fields={props?.fields} baseName={`${props.baseName || ''}${getName(props)}.${index}.`} />
                                </Box>
                            </Component.CmtFormBlock>
                        ))}

                    <Component.CmtEndPositionWrapper>
                        <Component.AddBlockButton
                            size="small"
                            id="addField"
                            variant="outlined"
                            color="primary"
                            onClick={() => {
                                push(props?.newObject || {});
                            }}
                        >
                            <AddIcon /> Ajouter un champ
                        </Component.AddBlockButton>
                    </Component.CmtEndPositionWrapper>
                </>
            )}
        </FieldArray>
    ),
};

const getName = ({ name, ...props }) => {
    if (typeof name === 'function') {
        return name(props);
    }
    return name;
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

                                return <CmtInput key={index} {...inheritedProps} {...inputProps} name={inputProps.name} {...customProps} />;
                            })
                        )}
                    </Grid>
                );
            })}
        </>
    );
};
