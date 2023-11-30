import React from 'react';

import { Radio } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const CmtDisplayMediaElement = ({ title, mediasList, mediaType, openEditModal, values, name, setFieldValue }) => {
    return (
        <Component.CmtFormBlock title={title}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                {mediasList.map((item, index) => {
                    const valueIndex = values[name]?.findIndex((el) => el?.media?.id === item?.media?.id);

                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{
                                position: 'relative',
                            }}
                            onClick={() => {
                                openEditModal({
                                    item: item?.media,
                                    index: values[name].findIndex((el) => el?.media?.id === item?.media?.id),
                                });
                            }}
                            className="eventMediaElement"
                        >
                            <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} className="eventMediaType" />
                        </Component.CmtMediaElement>
                    );
                })}
            </Box>
        </Component.CmtFormBlock>
    );
};
