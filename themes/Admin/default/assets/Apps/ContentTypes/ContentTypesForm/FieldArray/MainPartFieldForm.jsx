import React, { useMemo } from 'react';

import { FormControl, InputLabel, ListSubheader, MenuItem, Select } from '@mui/material';

import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

import { getNestedFormikError } from '@Services/utils/getNestedFormikError';

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
    prefixId = prefixName.replaceAll('.', '-'),
    contentTypesModules,
}) => {
    const handleChangeFieldType = (value) => {
        contentTypesModules[value]?.setInitialValues(`${prefixName}fields.${index}`, setFieldValue);
    };

    const getSelectEntryList = useMemo(() => {
        let moduleSelectList = Object.entries(contentTypesModules)?.map(([key, item]) => item?.getSelectEntry());

        let selectList = {};

        moduleSelectList.map((item) => {
            if (!selectList[item.groupName]) {
                selectList[item.groupName] = [];
            }

            selectList[item.groupName].push({ label: item.label, name: item.name });
        });

        let sortList = [];

        Object.entries(selectList).forEach(([key, value]) => {
            const sortValue = [...value];
            sortValue.sort((a, b) => a.label > b.label);
            sortList.push({ groupName: key, contentTypes: [...sortValue] });
        });

        sortList.sort((a, b) => a.groupName > b.groupName);

        let sList = [];

        sortList.forEach((element) => {
            sList.push({ label: element.groupName });
            element.contentTypes?.forEach((it) => {
                sList.push(it);
            });
        });

        return sList;
    }, []);

    const ComplementInformation = contentTypesModules[values.type]?.ComplementInformation || null;

    return (
        <>
            <Component.CmtTextField
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Titre du champ"
                required
                name={`${prefixName}fields.${index}.title`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'title')}
            />

            <Component.CmtTextField
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                label="Nom du type de champ"
                required
                name={`${prefixName}fields.${index}.name`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'name')}
            />

            <FormControl fullWidth sx={{ marginTop: 3 }}>
                <InputLabel id={`${prefixId}fields-${index}-typeLabel`} size="small" className="required-input">
                    Type de champs
                </InputLabel>
                <Select
                    labelId={`${prefixId}fields-${index}-typeLabel`}
                    size="small"
                    variant="standard"
                    id={`${prefixId}fields-${index}-typeSelect`}
                    value={values.type}
                    onChange={(e) => {
                        handleChangeFieldType(e.target.value);
                        setFieldValue(`${prefixName}fields.${index}.type`, e.target.value);
                    }}
                    label="Type de champs"
                >
                    {getSelectEntryList?.map((typeList, typeIndex) =>
                        typeList?.name ? (
                            <MenuItem key={typeIndex} value={typeList?.name} id={`${prefixId}fields-${index}-typeValue-${typeIndex}`}>
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

            <Component.CmtTextField
                value={values.helper}
                onChange={handleChange}
                onBlur={handleBlur}
                multiline
                rows={3}
                label="Instructions"
                name={`${prefixName}fields.${index}.helper`}
                error={getNestedFormikError(touched?.fields, errors?.fields, index, 'helper')}
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
