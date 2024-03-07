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
    textField: ({ values, touched, errors, handleBlur, handleChange, value, error, ...props }) => (
        <Component.CmtTextField
            {...props}
            value={value ? value : getPropByString(values, `${props.baseName || ''}${getName(props)}`)}
            error={error ? error : getPropByString(touched, `${props.baseName || ''}${getName(props)}`) && getPropByString(errors, `${props.baseName || ''}${getName(props)}`)}
            onBlur={handleBlur}
            onChange={handleChange}
            name={`${props.baseName || ''}${getName(props)}`}
        />
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
    dateTime: ({ values, touched, errors, setFieldValue, setFieldTouched, ...props }) => (
        <Component.CmtDateTimePicker
            fullWidth
            {...props}
            value={props.value ? props.value : getPropByString(values, `${props.baseName || ''}${getName(props)}`)}
            setValue={(newValue) => {
                setFieldValue(`${props.baseName || ''}${getName(props)}`, newValue ? moment(newValue).format('YYYY-MM-DD HH:mm') : '');
            }}
            onTouched={setFieldTouched}
            name={`${props.baseName || ''}${getName(props)}`}
            error={
                props.error
                    ? props.error
                    : getPropByString(touched, `${props.baseName || ''}${getName(props)}`) && getPropByString(errors, `${props.baseName || ''}${getName(props)}`)
            }
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
            value={props[listName] && props[listName].length > 0 ? values[getName(props)] : ''}
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
    switch: ({ name, values, value, handleChange, label, labelPlacement, setFieldValue, sx, ...props }) => {
        return (
            <FormControlLabel
                control={
                    <Switch
                        checked={value || value === 0 ? Boolean(value) : Boolean(getPropByString(values, `${props.baseName || ''}${getName({ name })}`))}
                        onChange={
                            handleChange
                                ? handleChange
                                : (e) => {
                                      setFieldValue(`${props.baseName || ''}${getName({ name, props })}`, e.target.checked);
                                  }
                        }
                        name={`${props.baseName || ''}${getName({ name, props })}`}
                    />
                }
                label={label}
                labelPlacement={labelPlacement ? labelPlacement : 'start'}
                sx={sx}
            />
        );
    },
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
    fieldArray: ({ values, label, displayTitle, ...props }) => (
        <FieldArray name={`${props.baseName || ''}${getName(props)}`}>
            {({ remove, push }) => (
                <>
                    {values &&
                        getPropByString(values, `${props.baseName || ''}${getName(props)}`)?.map((item, index) => (
                            <Component.CmtFormBlock key={index} title={displayTitle ? `${label} N° ${index + 1}` : null}>
                                <Box key={index}>
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
                const { style, input, inputs, component: Cmt, components: Cmts, ...fieldProps } = field;
                const items = input ? [typeof input === 'function' ? input(inheritedProps) : input] : inputs;

                return (
                    <Grid item key={index} {...style}>
                        {Cmts ? (
                            Cmts.map((Cmt, index) => <Cmt key={index} {...fieldProps} {...inheritedProps} />)
                        ) : Cmt ? (
                            <Cmt {...fieldProps} {...inheritedProps} />
                        ) : (
                            items?.map((item, index) => {
                                if (!item) {
                                    return <React.Fragment key={index} />;
                                }

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
