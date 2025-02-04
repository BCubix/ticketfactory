import React, { useMemo } from 'react';

import { Component } from '@/AdminService/Component';

export const PageBlockContentPart = ({ values, pageColumnTypeModules, pageBlockTypesList, ...rest }) => {
    const pageBlockType = useMemo(() => {
        return pageBlockTypesList.find((it) => it.id === values.pageBlockType);
    }, []);

    return <Component.DisplayContentForm contentType={pageBlockType} values={values.fields} {...rest} />;
};
