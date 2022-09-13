import { Box } from '@mui/system';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { CmtTabs } from '../../../../Components/CmtTabs/CmtTabs';
import { CONTENT_TYPE_MODULES_EXTENSION } from '../../../../Constant';
import { MainPartFieldForm } from './MainPartFieldForm';

export const FieldArrayElem = ({
    values,
    index,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    prefixName,
    contentTypesModules,
}) => {
    const [tabList, setTabList] = useState([]);

    useEffect(() => {
        const moduleName =
            String(values.fieldType).charAt(0).toUpperCase() + values.fieldType?.slice(1);

        const list =
            contentTypesModules[`${moduleName}${CONTENT_TYPE_MODULES_EXTENSION}`]?.getTabList();

        setTabList(list);
    }, [values.fieldType]);

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
        <CmtTabs
            list={[
                {
                    label: 'Informations générale',
                    component: (
                        <MainPartFieldForm
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
