import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Component } from '@/AdminService/Component';
import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';

const TYPE = 'ImageFormat';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramAvailableValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    const dispatch = useDispatch();
    const [list, setList] = useState([]);

    useEffect(() => {
        apiMiddleware(dispatch, async () => {
            Api.imageFormatsApi.getAllImageFormat({ active: true }).then((result) => {
                if (result.result) {
                    setList(result.imageFormats);
                    return;
                }

                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            });
        });
    }, []);

    //console.log(list, paramValue);
    return (
        <Grid container item key={indexParam} {...paramBreakpoints} spacing={2}>
            <Component.CmtSelectField
                label={paramName}
                id={paramKey}
                multiple
                name={`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`}
                value={paramValue ? paramValue.split(', ') : []}
                list={list}
                getValue={(item) => item?.id?.toString()}
                getName={(item) => item?.name}
                setFieldValue={(name, value) => {
                    setFieldValue(name, value.join(', '));
                }}
            />
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
