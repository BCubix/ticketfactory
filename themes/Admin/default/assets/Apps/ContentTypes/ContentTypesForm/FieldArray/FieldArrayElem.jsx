import React, { useEffect, useState } from 'react';
import { Component } from '@/AdminService/Component';

export const FieldArrayElem = ({ values, index, errors, touched, handleChange, handleBlur, setFieldValue, setFieldTouched, prefixName, contentTypesModules }) => {
    const [tabList, setTabList] = useState([]);

    useEffect(() => {
        const list = contentTypesModules[values.type]?.getTabList();

        setTabList(list);
    }, [values.type]);

    if (!tabList) {
        return <></>;
    }

    const list = tabList.map((item) => ({
        label: item.label,
        component: (
            <item.component
                values={values}
                index={index}
                errors={errors}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                prefixName={prefixName}
            />
        ),
    }));

    return (
        <Component.CmtTabs
            list={[
                {
                    label: 'Informations générale',
                    component: (
                        <Component.MainPartFieldForm
                            values={values}
                            errors={errors}
                            touched={touched}
                            handleChange={handleChange}
                            handleBlur={handleBlur}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            index={index}
                            prefixName={prefixName}
                            contentTypesModules={contentTypesModules}
                        />
                    ),
                },
                ...list,
            ]}
            tabValue={0}
        />
    );
};
