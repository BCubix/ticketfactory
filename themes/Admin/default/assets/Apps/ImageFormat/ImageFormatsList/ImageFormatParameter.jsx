import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const ImageFormatParameter = () => {
    const dispatch = useDispatch();

    const [imageWEBPQuality, setImageWEBPQuality] = useState(null);
    const [imagePNGQuality, setImagePNGQuality] = useState(null);
    const [imageJPGQuality, setImageJPGQuality] = useState(null);
    const [imageFormat, setImageFormat] = useState(null);
    const [imageToCrop, setImageToCrop] = useState(null);

    const handleSubmit = async (values) => {
        const parameters = {
            parameters: [
                { paramKey: 'image_webp_quality', paramValue: values.image_webp_quality },
                { paramKey: 'image_png_quality',  paramValue: values.image_png_quality },
                { paramKey: 'image_jpg_quality',  paramValue: values.image_jpg_quality },
                { paramKey: 'image_format',       paramValue: values.image_format },
                { paramKey: 'image_to_crop',      paramValue: values.image_to_crop ? "1" : "0" },
            ],
        };

        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.editParameters(parameters);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            } else {
                NotificationManager.success(
                    'Les paramètres des images ont bien été modifiés.',
                    'Succès',
                    Constant.REDIRECTION_TIME
                );
            }
        });
    };

    useEffect(() => {
        [
            { key: 'image_webp_quality', setter: setImageWEBPQuality },
            { key: 'image_png_quality',  setter: setImagePNGQuality },
            { key: 'image_jpg_quality',  setter: setImageJPGQuality },
            { key: 'image_format',       setter: setImageFormat },
            { key: 'image_to_crop',      setter: setImageToCrop },
        ]
        .forEach(({ key, setter }) => {
            apiMiddleware(dispatch, async () => {
                const result = await Api.parametersApi.getParameterValueByKey(key);
                if (!result.result) {
                    NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                    return;
                }

                setter(result.parameter);
            });
        });
    }, []);

    if (null === imageWEBPQuality
     || null === imagePNGQuality
     || null === imageJPGQuality
     || null === imageFormat
     || null === imageToCrop
    ) {
        return <></>;
    }

    return (
        <Component.ImageFormatParameterForm
            initialValues={{
                image_webp_quality: imageWEBPQuality,
                image_png_quality: imagePNGQuality,
                image_jpg_quality: imageJPGQuality,
                image_format: imageFormat,
                image_to_crop: imageToCrop,
            }}
            handleSubmit={handleSubmit}
        />
    );
};