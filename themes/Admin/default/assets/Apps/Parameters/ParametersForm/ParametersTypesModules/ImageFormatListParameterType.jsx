import React, { useEffect, useState } from 'react';
import { FormControl, Grid, FormControlLabel, Checkbox } from '@mui/material';
import { NotificationManager } from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

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
                    setList(result.imageFormat);
                    return;
                }

                NotificationManager.error("Une erreur s'est produite", 'Erreur', Constant.REDIRECTION_TIME);
            });
        });
    }, [dispatch]);

    const handleCheckboxChange = (item) => {
        const newValues = paramValue ? paramValue.split(', ') : [];
        if (newValues.includes(String(item.id))) {
            const index = newValues.indexOf(String(item.id));
            newValues.splice(index, 1);
        } else {
            newValues.push(String(item.id));
        }
        setFieldValue(`tabs[${indexTab}].blocks[${indexBlock}].parameters[${indexParam}].paramValue`, newValues.join(', '));
        console.log('Updated paramValue:', newValues.join(', '));
    };

    return (
        <Grid container item key={indexParam} {...paramBreakpoints} spacing={2}>
            <FormControl fullWidth sx={{ marginBlock: 3, display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
                {list.map((item) => (
                    <Grid item key={item.id}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={paramValue ? paramValue.split(', ').includes(String(item.id)) : false}
                                    onChange={() => handleCheckboxChange(item)}
                                    value={item.id}
                                    name={item.name}
                                    color="primary"
                                />
                            }
                            label={item.name}
                        />
                    </Grid>
                ))}
            </FormControl>
        </Grid>
    );
};

export default {
    getType,
    getComponent,
};
