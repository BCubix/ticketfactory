import React, { useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

// TinyMCE so the global var exists
// eslint-disable-next-line no-unused-vars
import tinymce from 'tinymce/tinymce';
// DOM model
import 'tinymce/models/dom/model';
// Theme
import 'tinymce/themes/silver';
// Toolbar icons
import 'tinymce/icons/default';
// Editor styles
import 'tinymce/skins/ui/oxide/skin.min.css';

// importing the plugin js.
// if you use a plugin that is not listed here the editor will fail to load
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/template';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';

// importing plugin resources
import 'tinymce/plugins/emoticons/js/emojis';

// Content styles, including inline UI like fake cursors
/* eslint import/no-webpack-loader-syntax: off */
import contentCss from '!!raw-loader!tinymce/skins/content/default/content.min.css';
import contentUiCss from '!!raw-loader!tinymce/skins/ui/oxide/content.min.css';
import { useDispatch } from 'react-redux';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Api } from '@/AdminService/Api';
import { NotificationManager } from 'react-notifications';
import { Component } from '@/AdminService/Component';

export const LightEditor = ({ value, onChange, className, ...rest }) => {
    const dispatch = useDispatch();
    const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);
    const [filePickerCallback, setFilePickerCallback] = useState(null);
    const [image, setImage] = useState(null);
    const [imagesList, setImagesList] = useState(null);
    const [imageMediasTotal, setImageMediasTotal] = useState(null);
    const [mediaCategoriesList, setMediaCategoriesList] = useState(null);
    const [imageFormatList, setImageFormatList] = useState([]);
    const [mediaFilters, setMediaFilters] = useState({
        title: '',
        active: null,
        iframe: null,
        sort: 'id DESC',
        page: 1,
        limit: 20,
        type: '',
        category: '',
    });

    useEffect(() => {
        getImages();
    }, [mediaFilters]);

    const getImages = async () => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMediasList(mediaFilters);
            if (!result?.result) {
                NotificationManager.error('Une erreur est survenue, essayez de rafraichir la page.', 'Erreur', Constant.REDIRECTION_TIME);
            }

            setImagesList(result?.medias);
            setImageMediasTotal(result.total);
        });
    };

    const updatedMedia = (newValues) => {
        if (image?.id === newValues?.id) {
            setFieldValue(name, { ...newValues });
        }

        const lIndex = imagesList?.findIndex((el) => el.id === newValues.id);
        if (lIndex > -1) {
            let newList = imagesList;
            newList[lIndex] = newValues;
            setImagesList(newList);
        }
    };

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediaCategoriesApi.getAllMediaCategories();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            }

            setMediaCategoriesList(result.mediaCategories);

            Api.imageFormatsApi.getAllImageFormat({ active: true }).then((result) => {
                if (result.result) {
                    setImageFormatList(result.imageFormats);
                } else {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur');
                }
            });
        });
    }, []);

    // Simuler la sélection d'un fichier
    const handleFileSelection = (fileUrl) => {
        if (filePickerCallback) {
            filePickerCallback(fileUrl); // Retourne l'URL à TinyMCE
            setFilePickerCallback(null); // Réinitialise le callback
        }
        setIsMediaLibraryOpen(false); // Ferme la bibliothèque
    };

    const getFileManager = (callback, value, meta) => {
        setFilePickerCallback(() => (fileUrl) => {
            callback(fileUrl, { title: fileUrl });
        });
        setIsMediaLibraryOpen(true); // Ouvre la bibliothèque
    };

    return (
        <>
            <Editor
                value={value}
                onEditorChange={(newValue) => onChange(newValue)}
                className={className}
                init={{
                    height: 300,
                    menubar: true,
                    entity_encoding: 'raw',
                    plugins: [
                        'autolink',
                        'link',
                        'lists',
                        'image',
                        'charmap',
                        'anchor',
                        'searchreplace',
                        'wordcount',
                        'fullscreen',
                        'nonbreaking',
                        'media',
                        'save',
                        'table',
                        'directionality',
                        'code',
                    ],
                    toolbar:
                        'code | undo redo | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist | link image media | forecolor backcolor | customArrow customText',
                    content_style: contentUiCss.toString() + '\n' + contentCss.toString(),

                    file_picker_callback: getFileManager,
                    relative_urls: false,
                    image_caption: true,
                }}
                {...rest}
            />

            <Component.CmtMediaModal
                title={`Selectionner l'image §§§`}
                open={isMediaLibraryOpen}
                onClose={() => setIsMediaLibraryOpen(false)}
                mediasList={imagesList}
                media={image}
                setFieldValue={(value) => console.log(value)}
                name={name}
                onAddNewMedia={getImages}
                mediaFilters={mediaFilters}
                setMediaFilters={setMediaFilters}
                total={imageMediasTotal}
                categoriesList={mediaCategoriesList}
                updatedMedia={updatedMedia}
                imageFormatList={imageFormatList}
            />
        </>
    );
};
