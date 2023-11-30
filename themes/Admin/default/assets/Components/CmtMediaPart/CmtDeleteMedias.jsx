import React from 'react';

import { Component } from '@/AdminService/Component';
import { Box } from '@mui/system';

import DeleteIcon from '@mui/icons-material/Delete';

export const CmtDeleteMedias = ({ medias, setFieldValue, name }) => {
    const handleDeleteElement = (index) => {
        let newList = medias;
        newList.splice(index, 1);

        setFieldValue(name, newList);
    };

    return (
        <Component.CmtFormBlock title={'Médias'}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                {medias.map((item, index) => {
                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{
                                position: 'relative',
                                outline: (theme) => item.mainImg && `3px solid ${theme.palette.crud.action.textColor}`,
                                outlineOffset: item.mainImg && '-3px',
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
