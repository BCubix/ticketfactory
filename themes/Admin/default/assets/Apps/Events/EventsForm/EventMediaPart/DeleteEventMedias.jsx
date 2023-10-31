import React from 'react';

import { Component } from '@/AdminService/Component';
import { Box } from '@mui/system';

import DeleteIcon from '@mui/icons-material/Delete';

export const DeleteEventMedias = ({ eventMedias, setFieldValue }) => {
    const handleDeleteElement = (index) => {
        let newList = eventMedias;
        newList.splice(index, 1);

        setFieldValue('eventMedias', newList);
    };

    return (
        <Component.CmtFormBlock title={'Médias'}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                {eventMedias.map((item, index) => {
                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{
                                position: 'relative',
                                overflow: 'visible',
                            }}
                            className="eventMediaElement"
                        >
                            <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} className="eventMediaType" />
                            <Component.DeleteBlockFabButton
                                size="small"
                                onClick={() => {
                                    handleDeleteElement(index);
                                }}
                            >
                                <DeleteIcon />
                            </Component.DeleteBlockFabButton>
                        </Component.CmtMediaElement>
                    );
                })}
            </Box>
        </Component.CmtFormBlock>
    );
};
