import React from 'react';
import { CmtPageTitle } from '../CmtPageTitle/CmtPageTitle';
import { PageWrapper } from './sc.PageWrapper';

export const CmtPageWrapper = ({ children, title, ...params }) => {
    return (
        <PageWrapper {...params}>
            {title && <CmtPageTitle>{title}</CmtPageTitle>}
            {children}
        </PageWrapper>
    );
};
