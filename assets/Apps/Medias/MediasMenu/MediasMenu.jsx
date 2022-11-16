import React from 'react';
import { Component } from "@/AdminService/Component";
import { Constant } from "@/AdminService/Constant";

export const MediasMenu = ({ tabValue = 0 }) => {
    return (
        <Component.CmtTabs
            tabValue={tabValue}
            list={[
                { label: 'Médias', component: <Component.MediasList />, path: Constant.MEDIAS_BASE_PATH },
                {
                    label: "Formats d'images",
                    component: <Component.ImageFormatsList />,
                    path: Constant.IMAGE_FORMATS_BASE_PATH,
                },
            ]}
        />
    );
};
