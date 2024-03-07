import React from 'react';
import { Box } from '@mui/system';
import { Constant } from '@/AdminService/Constant';
import { getMediaType } from '@Services/utils/getMediaType';

const MEDIA_TYPE = [
    {
        type: 'image',
        component: ({ media, ...typeProps }) =>
            media.iframe ? (
                <Box component="img" src={media.documentUrl} alt="Fichier Image" sx={{ padding: 5 }} maxHeight="100%" maxWidth="100%" {...typeProps} />
            ) : (
                <Box component="img" src={Constant.MEDIA_FILE_BASE_URL + media.documentUrl} alt={media.alt} {...typeProps} />
            ),
    },
    {
        type: 'audio',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Audio.png`}
                alt="Fichier Audio"
                sx={{ padding: thumbnail ? 0 : 5 }}
                maxHeight="100%"
                maxWidth="100%"
                {...typeProps}
            />
        ),
    },
    {
        type: 'video',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Vidéos.png`}
                alt="Fichier Vidéo"
                sx={{ padding: thumbnail ? 0 : 5 }}
                maxHeight="100%"
                maxWidth="100%"
                {...typeProps}
            />
        ),
    },
    {
        type: 'word',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Word.png`}
                alt="Fichier Word"
                sx={{ padding: thumbnail ? 0 : 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'excel',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Excel.png`}
                alt="Fichier Excel"
                sx={{ padding: thumbnail ? 0 : 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'powerpoint',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                alt="Fichier Powerpoint"
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Powerpoint.png`}
                sx={{ padding: thumbnail ? 0 : 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'pdf',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: thumbnail ? 0 : 5 }}
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers PDF.png`}
                alt="Fichier Pdf"
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'text',
        component: ({ media, thumbnail, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: thumbnail ? 0 : 5 }}
                src={thumbnail || `${Constant.ICONS_FILE_PATH}/Fichiers Text.png`}
                alt="Fichier Text"
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
];

export const CmtDisplayMediaType = ({ media, displayThumbnail = false, ...typeProps }) => {
    const type = getMediaType(media.documentType);

    if (!type) {
        return <></>;
    }

    const Media = MEDIA_TYPE.find((el) => el.type === type)?.component;

    if (!Media) {
        return <></>;
    }

    return <Media media={media} thumbnail={displayThumbnail ? media?.realThumbnail : ''} {...typeProps} display="block" />;
};
