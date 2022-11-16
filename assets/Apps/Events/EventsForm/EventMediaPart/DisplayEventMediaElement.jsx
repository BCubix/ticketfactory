import React from 'react';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Radio } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from "@/AdminService/Component";

export const DisplayEventMediaElement = ({
    title,
    openAddModal,
    mediaType,
    mediaList,
    openEditModal,
    values,
    name,
    setFieldValue,
}) => {
    return (
        <Component.CmtFormBlock title={title}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                <Component.CmtMediaElement onClick={() => openAddModal(mediaType)}>
                    <Box className="placeholder">
                        <AddCircleOutlineOutlinedIcon />
                    </Box>
                </Component.CmtMediaElement>
                {mediaList.map((item, index) => {
                    const valueIndex = values.eventMedias?.findIndex((el) => el.id === item.id);

                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{ position: 'relative' }}
                            onClick={() => {
                                openEditModal({
                                    item,
                                    index,
                                });
                            }}
                        >
                            <Component.CmtDisplayMediaType media={item} width={'100%'} height={'auto'} />
                            {mediaType === 'Image' && (
                                <Radio
                                    checked={values.eventMedias.at(valueIndex)?.mainImg}
                                    sx={{ position: 'absolute', right: 2, top: 2 }}
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
