import React from 'react';

import { FormControlLabel, Grid, Switch } from '@mui/material';

import { Component } from '@/AdminService/Component';

import { changeSlug } from '@Services/utils/changeSlug';

export const EventMainPartForm = ({
    values,
    handleChange,
    handleBlur,
    touched,
    errors,
    setFieldTouched,
    setFieldValue,
    roomsList,
    seasonsList,
    categoriesList,
    tagsList,
    editMode,
}) => {
    return (
        <>
            <Component.CmtFormBlock title={'Informations générales'}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Component.CmtTextField
                            value={values.name}
                            onChange={(e) => {
                                setFieldValue('name', e.target.value);
                                if (!values.editSlug && !editMode) {
                                    setFieldValue('slug', changeSlug(e.target.value));
                                }
                            }}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                            required
                            sx={{ marginBottom: 6 }}
                        />
                        <Component.CmtSlugInput values={values} setFieldValue={setFieldValue} name="slug" />
                    </Grid>

                    <Grid item xs={12}>
                        <Component.CmtTextField
                            value={values.chapo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Chapô"
                            name="chapo"
                            error={touched.chapo && errors.chapo}
                            multiline
                            rows={4}
                            required
                            sx={{ marginTop: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Component.CmtEditorField
                            label="Description"
                            required
                            id={`description`}
                            name={`description`}
                            value={values.description}
                            setFieldValue={setFieldValue}
                            setFieldTouched={setFieldTouched}
                            errors={touched.description && errors.description}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Component.CmtSelectField
                            label="Salle"
                            name={`room`}
                            value={values.room}
                            list={roomsList}
                            getValue={(item) => item.id}
                            getName={(item) => item.name}
                            setFieldValue={setFieldValue}
                            errors={touched.room && errors.room}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Component.CmtSelectField
                            label="Saison"
                            name={`season`}
                            value={values.season}
                            list={seasonsList}
                            getValue={(item) => item.id}
                            getName={(item) => item.name}
                            setFieldValue={setFieldValue}
                            errors={touched.season && errors.season}
                        />
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>

            <Component.CmtFormBlock title={'Informations annexes'}>
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} display="flex" alignItems="center" flexWrap={'wrap'}>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={Boolean(values.useThirdPartyTicketing)}
                                    onChange={(e) => {
                                        setFieldValue('useThirdPartyTicketing', e.target.checked);
                                    }}
                                />
                            }
                            label={'Utiliser une billetterie externe ?'}
                            labelPlacement="start"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        {values.useThirdPartyTicketing ? (
                            <Component.CmtTextField
                                value={values.thirdPartyTicketingUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Url de billetterie externe"
                                name="thirdPartyTicketingUrl"
                                error={touched.thirdPartyTicketingUrl && errors.thirdPartyTicketingUrl}
                                type="url"
                            />
                        ) : (
                            <Component.CmtTextField
                                value={values.ticketingId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                label="Identifiant billetterie"
                                name="ticketingId"
                                error={touched.ticketingId && errors.ticketingId}
                                type="number"
                            />
                        )}
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Component.CmtTextField
                            value={values.eventLength}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Durée de l'évènement"
                            name="eventLength"
                            error={touched.eventLength && errors.eventLength}
                        />
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>

            <Component.CmtFormBlock title="Catégories">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Component.EventParentCategoryPartForm values={values} categoriesList={categoriesList} setFieldValue={setFieldValue} touched={touched} errors={errors} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Component.CmtSelectField
                            label="Tags"
                            multiple
                            name={`tags`}
                            value={values.tags}
                            list={tagsList}
                            getValue={(item) => item.id}
                            getName={(item) => item.name}
                            setFieldValue={setFieldValue}
                            errors={touched.tags && errors.tags}
                        />
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>

            <Component.SEOForm values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} touched={touched} errors={errors} />
        </>
    );
};
