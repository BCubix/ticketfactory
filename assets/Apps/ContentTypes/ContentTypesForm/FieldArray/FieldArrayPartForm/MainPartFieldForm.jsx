import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CmtTextField } from '../../../../../Components/CmtTextField/CmtTextField';
import { getNestedFormikError } from '../../../../../services/utils/getNestedFormikError';
import { FIELDS_TYPE, FIELDS_TYPE_LIST } from '../../fieldsType/fieldsType';
import { OtherFieldsPartFieldForm } from './OtherFieldsPartFieldForm';

export const MainPartFieldForm = ({
    values,
    index,
    touched,
    errors,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName,
}) => {
    const [fieldsTypeList, setFieldsTypeList] = useState([]);

    const handleChangeFieldType = (value) => {
        const fieldTypeObject = FIELDS_TYPE?.find((el) => el.name === value);
        let options = {};
        let validations = {};
        let otherFields = {};

        fieldTypeObject?.options?.forEach((el) => {
            options[el.name] =
                (values?.options && values?.options[el.name]) ||
                (el.type === 'boolean' ? false : '');
        });

        fieldTypeObject?.validations?.forEach((el) => {
            validations[el.name] =
                (values?.validations && values?.validations[el.name]) || el.initialValue;
        });

        fieldTypeObject?.otherFields?.forEach((el) => {
            otherFields[el.name] =
                (values?.otherFields && values?.otherFields[el.name]) ||
                el.initialValue ||
                (el.type === 'boolean' ? false : '');
        });

        setFieldValue(`${prefixName}fields.${index}.options`, options);
        setFieldValue(`${prefixName}fields.${index}.validations`, validations);
        setFieldValue(`${prefixName}fields.${index}.otherFields`, otherFields);
    };

    useEffect(() => {
        let list = [];

        FIELDS_TYPE_LIST?.forEach((groupName) => {
            list.push({ label: groupName?.groupName });

            groupName?.fieldsType?.forEach((fieldType) => {
                list.push(fieldType);
            });
        });

        setFieldsTypeList(list);
    }, []);

    return (
        <>
            <CmtTextField
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Titre du champ"
                name={`${prefixName}fields.${index}.title`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'title')}
            />

            <CmtTextField
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Nom du type de champ"
                name={`${prefixName}fields.${index}.name`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'name')}
            />

            <FormControl fullWidth sx={{ marginTop: 3 }}>
                <InputLabel id={`fieldsType-${index}-label`} size="small">
                    Type de champs
                </InputLabel>
                <Select
                    labelId={`fieldsType-${index}-label`}
                    size="small"
                    id={`fieldsType-${index}`}
                    value={values.fieldType}
                    onChange={(e) => {
                        handleChangeFieldType(e.target.value);
                        setFieldValue(`${prefixName}fields.${index}.fieldType`, e.target.value);
                    }}
                    label="Type de champs"
                >
                    {fieldsTypeList?.map((typeList, typeIndex) =>
                        typeList?.name ? (
                            <MenuItem key={typeIndex} value={typeList?.name}>
                                {typeList?.label}
                            </MenuItem>
                        ) : (
                            <ListSubheader key={typeIndex} sx={{ marginBottom: 1 }}>
                                {typeList?.label}
                            </ListSubheader>
                        )
                    )}
                </Select>
            </FormControl>

            <CmtTextField
                value={values.instructions}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
                label="Instructions"
                name={`${prefixName}fields.${index}.instructions`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'instructions')}
            />

            <OtherFieldsPartFieldForm
                values={values}
                fieldIndex={index}
                errors={errors && errors[index]}
                touched={touched && touched[index]}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                prefixName={prefixName}
            />
        </>
    );
};
