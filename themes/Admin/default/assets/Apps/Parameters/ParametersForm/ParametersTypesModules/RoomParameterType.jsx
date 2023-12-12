import React, { useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { Constant } from '@/AdminService/Constant';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { languagesSelector } from '@Apps/Languages/redux/languages/languagesSlice';

import ListParameterType from './ListParameterType';

const TYPE = 'Room';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, setFieldValue, indexTab, indexBlock, indexParam }) => {
    const dispatch = useDispatch();
    const languagesData = useSelector(languagesSelector);
    const [list, setList] = useState([]);

    useEffect(() => {
        if (!languagesData.languages || list.length > 0) {
            return;
        }

        const defaultLanguageId = languagesData.languages.find((el) => el.isDefault)?.id;
        if (!defaultLanguageId) {
            return;
        }

        apiMiddleware(dispatch, async () => {
            Api.roomsApi.getAllRooms({ lang: defaultLanguageId }).then((result) => {
                if (result.result) {
                    setList(result.rooms);
                    return;
                }

                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            });
        });
    }, [languagesData.languages]);

    return (
        <ListParameterType.getComponent
            paramName={paramName}
            paramKey={paramKey}
            paramValue={paramValue?.id || paramValue || ''}
            paramAvailableValue={list}
            paramBreakpoints={paramBreakpoints}
            setFieldValue={setFieldValue}
            indexTab={indexTab}
            indexBlock={indexBlock}
            indexParam={indexParam}
            paramNameKey="name"
        />
    );
};

export default {
    getType,
    getComponent,
};
