import { Box, Typography } from '@mui/material';
import { ALL_FILE_SUPPORTED, IMAGE_FILE_SUPPORTED } from '../../../../Constant';
import React from 'react';

export const FIELDS_TYPE = [
    {
        name: 'text',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'trim', label: 'Gérer les espaces inutiles', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minLength',
                label: 'Longueur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} caractères.`,
            },
            {
                name: 'maxLength',
                label: 'Longueur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} caractères.`,
            },
        ],
    },
    {
        name: 'textarea',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'trim', label: 'Gérer les espaces inutiles', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minLength',
                label: 'Longueur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} caractères.`,
            },
            {
                name: 'maxLength',
                label: 'Longueur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} caractères.`,
            },
        ],
    },
    {
        name: 'number',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Requis', type: 'boolean' },
            { name: 'scale', label: 'Nombre de chiffres après la virgule', type: 'number' },
        ],
        validations: [
            {
                name: 'min',
                label: 'Valeur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la valeur doit être supérieur ou égal à ${value}.`,
            },
            {
                name: 'max',
                label: 'Valeur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la valeur doit être inférieur ou égal à ${value}.`,
            },
        ],
    },
    {
        name: 'email',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'password',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minLength',
                label: 'Longueur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} caractères.`,
            },
            {
                name: 'maxLength',
                label: 'Longueur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} caractères.`,
            },
            {
                name: 'minChar',
                label: 'Caractères minuscules',
                type: 'boolean',
                initialValue: '',
                message: (value) => `Le mot de passe doit contenir au moins une lettre minuscule.`,
            },
            {
                name: 'majChar',
                label: 'Caractères majuscules',
                type: 'boolean',
                initialValue: '',
                message: (value) => `Le mot de passe doit contenir au moins une lettre majuscule.`,
            },
            {
                name: 'numberChar',
                label: 'Caractères numériques',
                type: 'boolean',
                initialValue: '',
                message: (value) => `Le mot de passe doit contenir au moins un chiffre.`,
            },
        ],
    },
    {
        name: 'url',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'date',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        validations: [
            {
                name: 'disablePast',
                label: 'Désactiver les dates passés',
                type: 'boolean',
                initialValue: '',
                message: (value) =>
                    `Vous ne pouvez pas renseigner une date inférieur à la date actuelle.`,
            },
            {
                name: 'minDate',
                label: 'Date minimum',
                type: 'date',
                initialValue: '',
                message: (value) => `La date doit être supérieur ou égal à ${value}.`,
            },
            {
                name: 'maxDate',
                label: 'Date maximum',
                type: 'date',
                initialValue: '',
                message: (value) => `La date doit être inférieur ou égal à ${value}.`,
            },
        ],
    },
    {
        name: 'time',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minHour',
                label: 'Heure minimum',
                type: 'time',
                initialValue: '',
                message: (value) => `L'heure doit être supérieur ou égal à ${value}.`,
            },
            {
                name: 'maxHour',
                label: 'Heure maximum',
                type: 'time',
                initialValue: '',
                message: (value) => `L'heure doit être inférieur ou égal à ${value}.`,
            },
        ],
    },
    {
        name: 'dateTime',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        validations: [
            {
                name: 'disablePast',
                label: 'Désactiver les dates passés',
                type: 'boolean',
                initialValue: '',
                message: (value) =>
                    `Vous ne pouvez pas renseigner une date inférieur à la date actuelle.`,
            },
            {
                name: 'minDate',
                label: 'Date minimum',
                type: 'date',
                initialValue: '',
                message: (value) => `La date doit être supérieur ou égal à ${value}.`,
            },
            {
                name: 'maxDate',
                label: 'Date maximum',
                type: 'date',
                initialValue: '',
                message: (value) => `La date doit être inférieur ou égal à ${value}.`,
            },
            {
                name: 'minHour',
                label: 'Heure minimum',
                type: 'time',
                initialValue: '',
                message: (value) => `L'heure doit être supérieur ou égal à ${value}.`,
            },
            {
                name: 'maxHour',
                label: 'Heure maximum',
                type: 'time',
                initialValue: '',
                message: (value) => `L'heure doit être inférieur ou égal à ${value}.`,
            },
        ],
    },
    {
        name: 'image',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'multiple', label: 'Multiple', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minSize',
                label: 'Taille minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `l'image doit peser au moins ${value} mo.`,
            },
            {
                name: 'maxSize',
                label: 'Taille maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `l'image doit peser moins de ${value} mo.`,
            },
            {
                name: 'minLength',
                label: 'Longueur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} pixels.`,
            },
            {
                name: 'maxLength',
                label: 'Longueur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} pixels.`,
            },
            {
                name: 'minHeight',
                label: 'Hauteur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} pixels.`,
            },
            {
                name: 'maxHeight',
                label: 'Hauteur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} pixels.`,
            },
            {
                name: 'type',
                label: "Type d'image",
                type: 'select',
                multiple: true,
                list: IMAGE_FILE_SUPPORTED?.split(','),
                initialValue: [],
                message: (value) => `Le type de l'image (${value}) n'est pas autorisé`,
            },
        ],
    },
    {
        name: 'file',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'multiple', label: 'Multiple', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minSize',
                label: 'Taille minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `le fichier doit peser au moins ${value} mo.`,
            },
            {
                name: 'maxSize',
                label: 'Taille maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `le fichier doit peser moins de ${value} mo.`,
            },
            {
                name: 'type',
                label: 'Type de fichier',
                type: 'select',
                multiple: true,
                list: ALL_FILE_SUPPORTED?.split(','),
                initialValue: [],
                message: (value) => `Le type du fichier (${value}) n'est pas autorisé`,
            },
        ],
    },
    {
        name: 'contentEditor',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'trim', label: 'Gérer les espaces inutiles', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minLength',
                label: 'Longueur minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être au moins de ${value} caractères.`,
            },
            {
                name: 'maxLength',
                label: 'Longueur maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `la longueur doit être inférieur à ${value} caractères.`,
            },
        ],
    },
    {
        name: 'slider',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minLength',
                label: "Nombre minimum d'éléments",
                type: 'number',
                initialValue: '',
                message: (value) => `le nombre d'élément doit être au moins de ${value} images.`,
            },
            {
                name: 'maxLength',
                label: "Nombre maximum d'éléments",
                type: 'number',
                initialValue: '',
                message: (value) => `le nombre d'élément doit être inférieur à ${value} images.`,
            },
        ],
    },
    {
        name: 'iframe',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'audio/video',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'multiple', label: 'Multiple', type: 'boolean' },
        ],
        validations: [
            {
                name: 'minSize',
                label: 'Taille minimum',
                type: 'number',
                initialValue: '',
                message: (value) => `le fichier doit peser au moins ${value} mo.`,
            },
            {
                name: 'maxSize',
                label: 'Taille maximum',
                type: 'number',
                initialValue: '',
                message: (value) => `le fichier doit peser moins de ${value} mo.`,
            },
        ],
    },
    {
        name: 'map',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'token', label: 'Token', type: 'text' },
            { name: 'mapStyle', label: 'Style de carte', type: 'text' },
            { name: 'lat', label: 'Latitude du centre', type: 'text' },
            { name: 'lng', label: 'Longitude du centre', type: 'text' },
            { name: 'zoom', label: 'Zoom', type: 'number' },
        ],
    },
    {
        name: 'color',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'choiceList',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'multiple', label: 'Multiple', type: 'boolean' },
            {
                name: 'choices',
                label: 'Choix',
                instructions: () => (
                    <Box>
                        <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                            Indiquez une valeur par ligne.
                        </Typography>
                        <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                            Vous pouvez spécifier la valeur et le libellé de cette manière.
                        </Typography>
                        <Typography
                            component="p"
                            variant="body2"
                            sx={{ marginTop: 2, fontSize: 10 }}
                        >
                            rouge : Rouge
                        </Typography>
                    </Box>
                ),
                type: 'textarea',
            },
        ],
    },
    {
        name: 'checkbox',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'radioButton',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            {
                name: 'choices',
                label: 'Choix',
                instructions: () => (
                    <Box>
                        <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                            Indiquez une valeur par ligne.
                        </Typography>
                        <Typography component="p" variant="body2" sx={{ fontSize: 10 }}>
                            Vous pouvez spécifier la valeur et le libellé de cette manière.
                        </Typography>
                        <Typography
                            component="p"
                            variant="body2"
                            sx={{ marginTop: 2, fontSize: 10 }}
                        >
                            rouge : Rouge
                        </Typography>
                    </Box>
                ),
                type: 'textarea',
            },
        ],
    },
    {
        name: 'true/false',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'externalLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'contentLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
            { name: 'class', label: 'Type de contenu', type: 'text' },
        ],
    },
    {
        name: 'eventLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'pageLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'categoryLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'tagLink',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
    },
    {
        name: 'groupFields',
        options: [
            { name: 'required', label: 'Requis', type: 'boolean' },
            { name: 'disabled', label: 'Désactivé', type: 'boolean' },
        ],
        otherFields: [{ name: 'fields', label: 'Champs', type: 'groupFields', initialValue: [] }],
    },
];

export const FIELDS_TYPE_LIST = [
    {
        groupName: 'Champs de base',
        fieldsType: [
            { name: 'text', label: 'Text' },
            { name: 'textarea', label: 'Text area' },
            { name: 'number', label: 'Nombre' },
            { name: 'email', label: 'Email' },
            { name: 'password', label: 'Mot de passe' },
            { name: 'url', label: 'Url' },
            { name: 'date', label: 'Date' },
            { name: 'time', label: 'Heure' },
            { name: 'dateTime', label: 'Date / Heure' },
        ],
    },
    {
        groupName: 'Contenu',
        fieldsType: [
            { name: 'image', label: 'Image' },
            { name: 'file', label: 'Fichier' },
            { name: 'contentEditor', label: 'Editeur de contenus' },
            { name: 'slider', label: 'Slider' },
            { name: 'iframe', label: 'Iframe' },
            { name: 'audio/video', label: 'Audio / Vidéo' },
            { name: 'map', label: 'Carte' },
            { name: 'color', label: 'Couleur' },
            { name: 'groupFields', label: 'Groupe de champs' },
        ],
    },
    {
        groupName: 'Choix',
        fieldsType: [
            { name: 'choiceList', label: 'Liste déroulante' },
            { name: 'checkbox', label: 'Case à cocher' },
            { name: 'radioButton', label: 'Boutons radio' },
            { name: 'true/false', label: 'Vrai / Faux' },
        ],
    },
    {
        groupName: 'Relationel',
        fieldsType: [
            { name: 'externeLink', label: 'Lien externe' },
            { name: 'contentLink', label: 'Lien vers contenu' },
            { name: 'eventLink', label: 'Lien vers un évènement' },
            { name: 'pageLink', label: 'Lien vers une page' },
            { name: 'categoryLink', label: 'Lien vers une catégorie' },
            { name: 'tagLink', label: 'Lien vers un tag' },
        ],
    },
];
