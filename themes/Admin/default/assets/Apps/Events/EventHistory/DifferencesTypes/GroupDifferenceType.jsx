import React from 'react';
import { Component } from '@/AdminService/Component';

export const GroupDifferenceType = ({ actualVersion, previousVersion, nextVersion, type, index, displayGroupHeader = true, ...props }) => {
    return <Component.CmtFormBlock title={type.title}></Component.CmtFormBlock>;
};
