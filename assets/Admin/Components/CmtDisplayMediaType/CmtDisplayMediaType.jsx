import React from 'react';
import { Box } from '@mui/system';
import { Constant } from "@/AdminService/Constant";
import { getMediaType } from '@Services/utils/getMediaType';

const MEDIA_TYPE = [
    {
        type: 'image',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={Constant.MEDIA_FILE_BASE_URL + media.documentUrl}
                alt={media.alt}
                {...typeProps}
            />
        ),
    },
    {
        type: 'audio',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Audio.png`}
                alt="Fichier Audio"
                sx={{ padding: 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'video',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Vidéos.png`}
                alt="Fichier Vidéo"
                sx={{ padding: 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'word',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Word.png`}
                alt="Fichier Word"
                sx={{ padding: 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'excel',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Excel.png`}
                alt="Fichier Excel"
                sx={{ padding: 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'powerpoint',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                alt="Fichier Powerpoint"
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Powerpoint.png`}
                sx={{ padding: 5 }}
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'pdf',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: 5 }}
                src={`${Constant.ICONS_FILE_PATH}/Fichiers PDF.png`}
                alt="Fichier Pdf"
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
    {
        type: 'text',
        component: ({ media, ...typeProps }) => (
            <Box
                component="img"
                sx={{ padding: 5 }}
                src={`${Constant.ICONS_FILE_PATH}/Fichiers Text.png`}
                alt="Fichier Text"
                maxHeight="100%"
                maxWidth="100%"
            />
        ),
    },
];

export const CmtDisplayMediaType = ({ media, ...typeProps }) => {
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
