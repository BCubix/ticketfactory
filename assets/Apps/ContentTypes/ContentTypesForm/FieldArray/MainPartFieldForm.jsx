import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';
import React from 'react';
import { useMemo } from 'react';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { CONTENT_TYPE_MODULES_EXTENSION } from '../../../../Constant';
import { getNestedFormikError } from '../../../../services/utils/getNestedFormikError';

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
    contentTypesModules,
}) => {
    const moduleName =
        String(values.fieldType).charAt(0).toUpperCase() +
        values.fieldType?.slice(1) +
        CONTENT_TYPE_MODULES_EXTENSION;

    const handleChangeFieldType = (value) => {
        const modName =
            String(value).charAt(0).toUpperCase() +
            value?.slice(1) +
            CONTENT_TYPE_MODULES_EXTENSION;

        contentTypesModules[modName]?.setInitialValues(
            `${prefixName}fields.${index}`,
            setFieldValue
        );
    };

    const getSelectEntryList = useMemo(() => {
        let moduleSelectList = Object.entries(contentTypesModules)?.map(([key, item]) =>
            item.getSelectEntry()
        );

        let selectList = {};

        moduleSelectList.map((item) => {
            if (!selectList[item.groupName]) {
                selectList[item.groupName] = [];
            }

            selectList[item.groupName].push({ label: item.label, name: item.name });
        });

        let sList = [];

        Object.entries(selectList).forEach(([key, value]) => {
            sList.push({ label: key });
            value.forEach((it) => {
                sList.push(it);
            });
        });

        return sList;
    }, []);

    const ComplementInformation = contentTypesModules[moduleName]?.ComplementInformation || null;

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
                    variant="standard"
                    id={`fieldsType-${index}`}
                    value={values.fieldType}
                    onChange={(e) => {
                        handleChangeFieldType(e.target.value);
                        setFieldValue(`${prefixName}fields.${index}.fieldType`, e.target.value);
                    }}
                    label="Type de champs"
                >
                    {getSelectEntryList?.map((typeList, typeIndex) =>
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

            {ComplementInformation && (
                <ComplementInformation
                    values={values}
                    index={index}
                    errors={errors}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    setFieldTouched={setFieldTouched}
                    prefixName={prefixName}
                    contentTypesModules={contentTypesModules}
                />
            )}
        </>
    );
};
