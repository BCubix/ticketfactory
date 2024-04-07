import React, { useEffect, useMemo } from 'react';
import { NotificationManager } from 'react-notifications';
import { FormControlLabel, FormLabel, Grid, Radio, RadioGroup, Switch, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Component } from '@/AdminService/Component';
import { Constant } from '@/AdminService/Constant';

export const TicketingModulePartForm = ({ setFieldValue, handleChange, values, formCrud, module, title, ...props }) => {
    const navigate = useNavigate();

    const availableTypes = useMemo(() => {
        let available = { api: false, iframe: false, external: false };

        if (!module || formCrud?.ticketingList[module?.name]) {
            available = { ...available, ...(formCrud?.ticketingList[module?.name || 'default']?.use || {}) };
        } else {
            NotificationManager.error("La billetterie n'a pas été trouvé.", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.TICKETING_BASE_PATH);
            return {};
        }

        return available;
    }, []);

    const apiOptions = useMemo(() => {
        let options = { catalogSynchronization: false, customerProfile: false, orderTunnel: false };

        if (!module || formCrud?.ticketingList[module?.name]) {
            options = { ...options, ...(formCrud?.ticketingList[module?.name || 'default']?.apiOptions || {}) };
        } else {
            NotificationManager.error("La billetterie n'a pas été trouvé.", 'Erreur', Constant.REDIRECTION_TIME);
            navigate(Constant.TICKETING_BASE_PATH);
            return {};
        }

        return options;
    }, []);

    useEffect(() => {
        if (values?.type) {
            return;
        }

        const list = ['api', 'iframe', 'external'];
        const search = list.find((item) => Boolean(availableTypes[item]));
        if (search) {
            setFieldValue('type', search);
        }
    }, []);

    useEffect(() => {
        const list = ['catalogSynchronization', 'customerProfile', 'orderTunnel'];
        list.forEach((it) => {
            if (!apiOptions[it]) {
                setFieldValue(it, false);
            }
        });
    }, []);

    return (
        <Component.CmtFormBlock title={title}>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={2} sx={{ borderRight: '1px solid #d3d3d3' }}>
                    <FormLabel id="ticketing-type-label">Type d'utilisation</FormLabel>
                    <RadioGroup aria-labelledby="ticketing-type-label" defaultValue="" name="type" value={values.type || ''} onChange={handleChange}>
                        <Tooltip title={!Boolean(availableTypes?.api) ? 'Type non pris en charge par le module.' : ''}>
                            <FormControlLabel value="api" control={<Radio />} label="Api" disabled={!Boolean(availableTypes?.api)} />
                        </Tooltip>

                        <Tooltip title={!Boolean(availableTypes?.iframe) ? 'Type non pris en charge par le module.' : ''}>
                            <FormControlLabel value="iframe" control={<Radio />} label="Iframe" disabled={!Boolean(availableTypes?.iframe)} />
                        </Tooltip>

                        <Tooltip title={!Boolean(availableTypes?.external) ? 'Type non pris en charge par le module.' : ''}>
                            <FormControlLabel value="external" control={<Radio />} label="Externe" disabled={!Boolean(availableTypes?.external)} />
                        </Tooltip>
                    </RadioGroup>
                </Grid>

                {values?.type && formCrud?.ticketingList[module?.name || 'default']?.formFields[values?.type] && (
                    <Grid item container xs={12} sm={10} spacing={4}>
                        <Component.CmtDisplayFields
                            fields={formCrud?.ticketingList[module?.name || 'default']?.formFields[values?.type]}
                            values={values}
                            {...{ setFieldValue, handleChange, formCrud, module }}
                            {...props}
                        />

                        {values?.type === 'api' && (
                            <Grid item xs={12}>
                                <Tooltip title={!Boolean(apiOptions?.catalogSynchronization) ? 'Fonctionnalité non prise en charge par le module.' : ''}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={Boolean(values?.catalogSynchronization)}
                                                name="catalogSynchronization"
                                                onChange={handleChange}
                                                disabled={!Boolean(apiOptions?.catalogSynchronization)}
                                            />
                                        }
                                        label="Synchronisation catalogue"
                                    />
                                </Tooltip>

                                <Tooltip title={!Boolean(apiOptions?.customerProfile) ? 'Fonctionnalité non prise en charge par le module.' : ''}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={Boolean(values?.customerProfile)}
                                                name="customerProfile"
                                                onChange={handleChange}
                                                disabled={!Boolean(apiOptions?.customerProfile)}
                                            />
                                        }
                                        label="Profil client"
                                    />
                                </Tooltip>

                                <Tooltip title={!Boolean(apiOptions?.orderTunnel) ? 'Fonctionnalité non prise en charge par le module.' : ''}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={Boolean(values?.orderTunnel)}
                                                name="orderTunnel"
                                                onChange={handleChange}
                                                disabled={!Boolean(apiOptions?.orderTunnel)}
                                            />
                                        }
                                        label="Tunnel de commande"
                                    />
                                </Tooltip>
                            </Grid>
                        )}
                    </Grid>
                )}
            </Grid>
        </Component.CmtFormBlock>
    );
};
