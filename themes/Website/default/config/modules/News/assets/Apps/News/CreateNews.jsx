import React, {useEffect, useState} from 'react';
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";
import { getMediaType } from "@/services/utils/getMediaType";

import { getNewsesAction } from "../../redux/news/newsesSlice";
import { apiMiddleware } from "@/services/utils/apiMiddleware";

export const CreateNews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [mediasList, setMediasList] = useState(null);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            const result = await Api.mediasApi.getMedias();
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.NEWS_BASE_PATH);
                return;
            }

            const images =
                result?.medias?.filter((el) => getMediaType(el.documentType) === 'image') || [];
            setMediasList(images);
        });
    }, []);

    async function handleSubmit(values) {
        await apiMiddleware(dispatch, async () => {
            const result = await Api.newsesApi.createNews(values);

            if (result.result) {
                NotificationManager.success('L\'actualité a bien été créée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getNewsesAction());
                navigate(Constant.NEWS_BASE_PATH);
            }
        });
    }

    if (!mediasList)
        return <></>;

    return <Component.NewsForm handleSubmit={handleSubmit} mediasList={mediasList} />;
}

export default { CreateNews };