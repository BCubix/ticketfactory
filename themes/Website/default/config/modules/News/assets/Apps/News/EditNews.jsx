import React, {useEffect, useState} from "react";
import { NotificationManager } from "react-notifications";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { Api } from "@/AdminService/Api";
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

import { getNewsesAction } from "../../redux/news/newsesSlice";
import { apiMiddleware } from "@/services/utils/apiMiddleware";
import { getMediaType } from "@/services/utils/getMediaType";

export const EditNews = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const [news, setNews] = useState(null);
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

    async function getNews (id) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.newsesApi.getOneNews(id);
            if (!result.result) {
                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
                navigate(Constant.NEWS_BASE_PATH);
                return;
            }

            setNews(result.news);
        });
    }

    useEffect(() => {
        if (!id) {
            navigate(Constant.NEWS_BASE_PATH);
            return;
        }

        getNews(id);
    }, [id]);

    async function handleSubmit (values) {
        apiMiddleware(dispatch, async () => {
            const result = await Api.newsesApi.editNews(id, values);
            if (result.result) {
                NotificationManager.success('L\'actualité a bien été modifiée.', 'Succès', Constant.REDIRECTION_TIME);
                dispatch(getNewsesAction());
                navigate(Constant.NEWS_BASE_PATH);
            }
        });
    }

    if (news == null || mediasList == null) {
        return <></>;
    }

    return <Component.NewsForm handleSubmit={handleSubmit} initialValues={news} mediasList={mediasList} />
}

export default { EditNews };