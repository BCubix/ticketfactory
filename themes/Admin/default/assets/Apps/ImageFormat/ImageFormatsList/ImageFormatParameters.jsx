import React, { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { apiMiddleware } from "@Services/utils/apiMiddleware";

export const ImageFormatParameters = () => {
    const dispatch = useDispatch();
    const [imageFormatParameters, setImageFormatParameters] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.getParameters();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                return;
            }

            const parameters = result.parameters
                .filter(({ paramKey }) => paramKey.startsWith('image_'))
                .reduce((param, { paramKey, paramValue }) => {
                    param[paramKey] = paramValue;
                    return param;
                }, {});
            setImageFormatParameters(parameters);
        });
    }, []);

    const handleSubmit = async (values) => {
        const parameters = Object.entries(values).map(([key, value]) =>(
            { paramKey: key, paramValue: typeof value === "boolean" ? (value ? "1" : "0") : value }
        ));

        apiMiddleware(dispatch, async () => {
            const result = await Api.parametersApi.editParameters({ parameters: parameters });
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

    if (null === imageFormatParameters) {
        return <></>;
    }

    return (
        <Component.ImageFormatParametersForm
            initialValues={imageFormatParameters}
            handleSubmit={handleSubmit}
        />
    );
};