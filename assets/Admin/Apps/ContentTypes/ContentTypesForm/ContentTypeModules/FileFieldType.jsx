import React, { useMemo } from 'react';

import { FormControlLabel, ListItemText, MenuItem, Select, Switch } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

const NAME = 'file';
const LABEL = 'Fichier';

const TYPE = 'file';
const TYPE_GROUP_NAME = 'Contenu';

const Options = ({ values, index, setFieldValue, prefixName }) => {
    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.required)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.required`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Requis'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.disabled)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.disabled`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Désactivé'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(values.options.multiple)}
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.options.multiple`,
                                    e.target.checked
                                );
                            }}
                        />
                    }
                    label={'Multiple'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const Validations = ({
    values,
    errors,
    index,
    handleChange,
    handleBlur,
    setFieldValue,
    prefixName,
}) => {
    const imageTypeList = useMemo(() => {
        const list = Constant.ALL_FILE_SUPPORTED.split(',');

        return list.map((el) => el.trim());
    }, []);

    return (
        <>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.minSize}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.minSize`}
                            error={errors?.validations?.minSize}
                            type="number"
                        />
                    }
                    label={'Taille minimum'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Component.CmtTextField
                            value={values.validations.maxSize}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name={`${prefixName}fields.${index}.validations.maxSize`}
                            error={errors?.validations?.maxSize}
                            type="number"
                        />
                    }
                    label={'Taille maximum'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>

            <Component.FieldFormControl fullWidth>
                <FormControlLabel
                    control={
                        <Select
                            sx={{ marginTop: 3 }}
                            labelId={`imageType-${index}-label`}
                            size="small"
                            variant="standard"
                            id="imageType"
                            fullWidth
                            value={values.validations.type}
                            multiple
                            onChange={(e) => {
                                setFieldValue(
                                    `${prefixName}fields.${index}.validations.type`,
                                    e.target.value
                                );
                            }}
                            renderValue={(val) => {
                                return val.map((item, index) => (
                                    <Box component="span" sx={{ paddingRight: 2 }}>
                                        {item}
                                        {index < val.length - 1 && ','}
                                    </Box>
                                ));
                            }}
                        >
                            {imageTypeList.map((item, index) => (
                                <MenuItem value={item} key={index}>
                                    <ListItemText>{item}</ListItemText>
                                </MenuItem>
                            ))}
                        </Select>
                    }
                    label={'Types de fichiers autorisés'}
                    labelPlacement="start"
                />
            </Component.FieldFormControl>
        </>
    );
};

const getSelectEntry = () => ({ name: NAME, label: LABEL, type: TYPE, groupName: TYPE_GROUP_NAME });

const getTabList = () => [
    { label: 'Options', component: (props) => <Options {...props} /> },
    { label: 'Validations', component: (props) => <Validations {...props} /> },
];

const setInitialValues = (prefixName, setFieldValue) => {
    setFieldValue(`${prefixName}.options`, getInitialValues().options);
    setFieldValue(`${prefixName}.validations`, getInitialValues().validations);
};

const getInitialValues = () => ({
    options: { required: false, disabled: false, multiple: false },
    validations: {
        minSize: '',
        maxSize: '',
        minLength: '',
        maxLength: '',
        minHeight: '',
        maxHeight: '',
        type: [],
    },
});

export default {
    Options,
    Validations,
    getSelectEntry,
    getTabList,
    setInitialValues,
    getInitialValues,
};
