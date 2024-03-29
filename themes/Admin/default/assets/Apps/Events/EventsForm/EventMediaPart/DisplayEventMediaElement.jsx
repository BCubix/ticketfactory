import React from 'react';

import { Radio } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';

export const DisplayEventMediaElement = ({ title, mediasList, mediaType, openEditModal, values, name, setFieldValue }) => {
    return (
        <Component.CmtFormBlock title={title}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                {mediasList.map((item, index) => {
                    const valueIndex = values.eventMedias?.findIndex((el) => el?.media?.id === item?.media?.id);

                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{
                                position: 'relative',
                                outline: (theme) => item.mainImg && `3px solid ${theme.palette.crud.action.textColor}`,
                                outlineOffset: item.mainImg && '-3px',
                            }}
                            onClick={() => {
                                openEditModal({
                                    item: item?.media,
                                    index: values?.eventMedias?.findIndex((el) => el?.media?.id === item?.media?.id),
                                });
                            }}
                            className="eventMediaElement"
                        >
                            <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} className="eventMediaType" />

                            {mediaType === 'image' && (
                                <Radio
                                    checked={values.eventMedias.at(valueIndex)?.mainImg}
                                    className="showOnHover"
                                    sx={{ position: 'absolute', right: 2, top: 2 }}
                                    title="Image principale"
                                    onClick={(e) => {
                                        e.stopPropagation();

                                        let newValue = values.eventMedias.map((el, ind) => {
                                            return {
                                                ...el,
                                                mainImg: ind === valueIndex ? true : false,
                                            };
                                        });
                                        setFieldValue(name, newValue);
                                    }}
                                />
                            )}
                        </Component.CmtMediaElement>
                    );
                })}
            </Box>
        </Component.CmtFormBlock>
    );
};
