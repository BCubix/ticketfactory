import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { CmtTextField } from '../../../../../Components/CmtTextField/CmtTextField';
import { contentTypeFieldsSelector } from '../../../../../redux/contentTypeFields/contentTypeFieldsSlice';
import { getNestedFormikError } from '../../../../../services/utils/getNestedFormikError';
import { FIELDS_TYPE_LIST } from '../../fieldsType/fieldsType';
import { OtherFieldsPartFieldForm } from './OtherFieldsPartFieldForm';

function importAll(r) {
    let components = {};
    r.keys().map((item, index) => {
        components[item.replace('./', '')] = r(item).default;
    });
    return components;
}

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
    const { contentTypeFields } = useSelector(contentTypeFieldsSelector);
    const [fieldsTypeList, setFieldsTypeList] = useState([]);

    const Components = importAll(require.context('./Tests', false, /\.jsx$/));

    console.log(Components);
    const App = Components['Test1Component.jsx'];

    const handleChangeFieldType = (value) => {
        let fieldTypeObject = contentTypeFields[value];

        if (!fieldTypeObject) {
            return;
        }

        let options = {};
        let validations = {};
        let otherFields = {};

        if (fieldTypeObject?.options) {
            Object.entries(fieldTypeObject?.options)?.forEach(([key, value]) => {
                options[key] =
                    (values?.options && values?.options[key]) ||
                    (value.type === 'boolean' ? false : '');
            });
        }

        if (fieldTypeObject?.validations) {
            Object.entries(fieldTypeObject?.validations)?.forEach(([key, value]) => {
                if (value?.validations?.react) {
                    validations[key] =
                        (values?.validations && values?.validations[key]) ||
                        value?.react?.initialValue ||
                        (value?.react?.type === 'boolean' ? false : '');
                }
            });
        }

        if (fieldTypeObject?.otherFields) {
            Object.entries(fieldTypeObject?.otherFields)?.forEach(([key, value]) => {
                otherFields[key] =
                    (values?.otherFields && values?.otherFields[key]) ||
                    value.initialValue ||
                    (value.type === 'boolean' ? false : '');
            });
        }

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

    if (!fieldsTypeList) {
        return <></>;
    }

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

            <App name={'toto'} />
        </>
    );
};
