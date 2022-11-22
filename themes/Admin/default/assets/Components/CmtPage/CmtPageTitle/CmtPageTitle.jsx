import React from 'react';
import { Component } from "@/AdminService/Component";

export const CmtPageTitle = ({ children, ...params }) => {
    return (
        <Component.TitleTypography component="h1" variant="h5" {...params}>
            {children}
        </Component.TitleTypography>
    );
};
