import React from 'react';

import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { Radio } from '@mui/material';
import { Box } from '@mui/system';

import { Component } from '@/AdminService/Component';
import { getMediaType } from '@Services/utils/getMediaType';

export const DisplayEventMediaElement = ({ title, openAddModal, mediaType, openEditModal, values, name, setFieldValue, id }) => {
    let mediaTypeList = ['audio', 'video', 'pdf'];

    if (mediaType === 'Image') {
        mediaTypeList = ['image'];
    }

    const list = values?.eventMedias?.filter((el) => mediaTypeList.includes(getMediaType(el.media.documentType))) || [];

    return (
        <Component.CmtFormBlock title={title}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                <Component.CmtMediaElement onClick={() => openAddModal(mediaType)} id={`${id}-add`}>
                    <Box className="placeholder">
                        <AddCircleOutlineOutlinedIcon />
                    </Box>
                </Component.CmtMediaElement>
                {list.map((item, index) => {
                    const valueIndex = values.eventMedias?.findIndex((el) => el?.media?.id === item?.media?.id);

                    return (
                        <Component.CmtMediaElement
                            key={index}
                            sx={{ position: 'relative' }}
                            onClick={() => {
                                openEditModal({
                                    item: item?.media,
                                    index: values?.eventMedias?.findIndex((el) => el?.media?.id === item?.media?.id),
                                });
                            }}
                        >
                            <Component.CmtDisplayMediaType media={item.media} width={'100%'} height={'auto'} />
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
