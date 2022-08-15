import { Box } from '@mui/system';
import React from 'react';
import { MEDIA_FILE_BASE_URL } from '../../../Constant';
import { getMediaType } from '../../../services/utils/getMediaType';

const MEDIA_TYPE = [
    {
        type: 'image',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={MEDIA_FILE_BASE_URL + media.documentUrl}
                alt={media.alt}
                {...typeProps}
            />
        ),
    },
];

export const DisplayMediaType = ({ media, ...typeProps }) => {
    const type = getMediaType(media.documentType);

    console.log(media, type);
    if (!type) {
        return <></>;
    }

    const Media = MEDIA_TYPE.find((el) => (el.type = type))?.component;

    if (!Media) {
        return <></>;
    }

    return <Media media={media} {...typeProps} display="block" />;
};
