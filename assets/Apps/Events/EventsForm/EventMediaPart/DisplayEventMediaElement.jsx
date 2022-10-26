import { Box } from '@mui/system';
import React from 'react';
import { CmtMediaElement } from '../../../../Components/CmtMediaElement/sc.MediaElement';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import { CmtDisplayMediaType } from '../../../../Components/CmtDisplayMediaType/CmtDisplayMediaType';
import { Radio } from '@mui/material';
import { CmtFormBlock } from '../../../../Components/CmtFormBlock/CmtFormBlock';

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
        <CmtFormBlock title={title}>
            <Box sx={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                <CmtMediaElement onClick={() => openAddModal(mediaType)}>
                    <Box className="placeholder">
                        <AddCircleOutlineOutlinedIcon />
                    </Box>
                </CmtMediaElement>
                {mediaList.map((item, index) => {
                    const valueIndex = values.eventMedias?.findIndex((el) => el.id === item.id);

                    return (
                        <CmtMediaElement
                            key={index}
                            sx={{ position: 'relative' }}
                            onClick={() => {
                                openEditModal({
                                    item,
                                    index,
                                });
                            }}
                        >
                            <CmtDisplayMediaType media={item} width={'100%'} height={'auto'} />
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
                        </CmtMediaElement>
                    );
                })}
            </Box>
        </CmtFormBlock>
    );
};
