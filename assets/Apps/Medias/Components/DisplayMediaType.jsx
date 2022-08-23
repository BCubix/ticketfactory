import { Box } from '@mui/system';
import React from 'react';
import { ICONS_FILE_PATH, MEDIA_FILE_BASE_URL } from '../../../Constant';
import { getMediaType } from '../../../services/utils/getMediaType';

const MEDIA_TYPE = [
    {
        type: 'image',
        component: ({ media, ...typeProps }) => (
            <Box component="img" src={MEDIA_FILE_BASE_URL + media.documentUrl} alt={media.alt} />
        ),
    },
    {
        type: 'audio',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${ICONS_FILE_PATH}/Fichiers Audio.png`}
                alt="Fichier Audio"
                sx={{ padding: 5 }}
            />
        ),
    },
    {
        type: 'video',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${ICONS_FILE_PATH}/Fichiers Vidéos.png`}
                alt="Fichier Vidéo"
                sx={{ padding: 5 }}
            />
        ),
    },
    {
        type: 'word',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${ICONS_FILE_PATH}/Fichiers Word.png`}
                alt="Fichier Word"
                sx={{ padding: 5 }}
            />
        ),
    },
    {
        type: 'excel',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${ICONS_FILE_PATH}/Fichiers Excel.png`}
                alt="Fichier Excel"
                sx={{ padding: 5 }}
            />
        ),
    },
    {
        type: 'powerpoint',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                alt="Fichier Powerpoint"
                src={`${ICONS_FILE_PATH}/Fichiers Powerpoint.png`}
                sx={{ padding: 5 }}
            />
        ),
    },
    {
        type: 'pdf',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: 5 }}
                src={`${ICONS_FILE_PATH}/Fichiers PDF.png`}
                alt="Fichier Pdf"
            />
        ),
    },
    {
        type: 'text',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: 5 }}
                src={`${ICONS_FILE_PATH}/Fichiers Text.png`}
                alt="Fichier Text"
            />
        ),
    },
];

export const DisplayMediaType = ({ media, ...typeProps }) => {
    const type = getMediaType(media.documentType);

    if (!type) {
        return <></>;
    }

    const Media = MEDIA_TYPE.find((el) => el.type === type)?.component;

    if (!Media) {
        return <></>;
    }

    return <Media media={media} {...typeProps} display="block" />;
};
