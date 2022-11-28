import React from 'react';
import { Component } from "@/AdminService/Component";

export const CmtPageWrapper = ({ children, title, ...params }) => {
    return (
        <Component.PageWrapper {...params}>
            {title && <Component.CmtPageTitle>{title}</Component.CmtPageTitle>}
            {children}
        </Component.PageWrapper>
    );
};
