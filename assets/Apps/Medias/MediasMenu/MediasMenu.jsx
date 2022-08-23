import React from 'react';
import { CmtTabs } from '../../../Components/CmtTabs/CmtTabs';
import { IMAGE_FORMATS_BASE_PATH, MEDIAS_BASE_PATH } from '../../../Constant';
import { ImageFormatsList } from '../../ImageFormat/ImageFormatsList/ImageFormatsList';
import { MediasList } from '../MediasList/MediasList';

export const MediasMenu = ({ tabValue = 0 }) => {
    return (
        <CmtTabs
            tabValue={tabValue}
            list={[
                { label: 'Médias', component: <MediasList />, path: MEDIAS_BASE_PATH },
                {
                    label: "Formats d'images",
                    component: <ImageFormatsList />,
                    path: IMAGE_FORMATS_BASE_PATH,
                },
            ]}
        />
    );
};
