import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import { NotificationManager } from 'react-notifications';
import { useDispatch } from 'react-redux';

import { Api } from '@/AdminService/Api';
import { apiMiddleware } from '@Services/utils/apiMiddleware';
import { Constant } from '@/AdminService/Constant';

const TYPE = 'int';

function getType() {
    return TYPE;
}

const getComponent = ({ paramName, paramKey, paramValue, paramBreakpoints, indexParam }) => {
    const dispatch = useDispatch();
    const [isExecute, setExecute] = useState(false);

    const onClick = () => {
        apiMiddleware(dispatch, async () => {
            setExecute(true);

            const result = await Api.parametersApi.executeRequestButton(paramValue);
            if (result.result) {
                NotificationManager.success('Votre demande à bien été prise en compte.', 'Succès', Constant.REDIRECTION_TIME);
            }

            setExecute(false);
        });
    };

    return (
        <Grid item key={indexParam} {...paramBreakpoints} display="flex" alignItems="center">
            <Button type="button" variant="contained" id={`button-${paramKey}`} disabled={isExecute} onClick={onClick}>
                {paramName}
            </Button>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
