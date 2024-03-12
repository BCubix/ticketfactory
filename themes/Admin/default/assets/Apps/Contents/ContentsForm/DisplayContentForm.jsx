import React from 'react';
import { Box } from '@mui/system';
import { Component } from '@/AdminService/Component';

export const DisplayContentForm = ({ contentType, ...props }) => {
    if (!contentType) {
        return <></>;
    }

    return contentType?.fields?.map((item, index) => (
        <Box sx={{ marginBlock: 4 }} key={index}>
            <Component.DisplayContentField {...props} field={item} key={index} index={index} />
        </Box>
    ));
};
