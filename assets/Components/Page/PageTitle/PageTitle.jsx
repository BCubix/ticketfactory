import React from 'react';
import { TitleTypography } from './sc.TitleTypography';

export const PageTitle = ({ children, ...params }) => {
    return (
        <TitleTypography component="h1" variant="h5" {...params}>
            {children}
        </TitleTypography>
    );
};
