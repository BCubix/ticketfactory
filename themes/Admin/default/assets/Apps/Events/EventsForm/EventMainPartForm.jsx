import React from 'react';

import { Checkbox, FormControl, FormHelperText, Grid, InputLabel, ListItemText, MenuItem, Select } from '@mui/material';

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
                        <InputLabel id="description" required>
                            Description
                        </InputLabel>
                        <Component.LightEditorFormControl id={`descriptionControl`}>
                            <Component.LightEditor
                                labelId="description"
                                value={values.description}
                                onBlur={() => setFieldTouched('description', true, false)}
                                onChange={(val) => {
                                    setFieldValue('description', val);
                                }}
                            />
                            {touched.description && errors.description && (
                                <FormHelperText error id="description-helper-text">
                                    {errors.description}
                                </FormHelperText>
                            )}
                        </Component.LightEditorFormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="eventRoomLabel" size="small">
                                Salle
                            </InputLabel>
                            <Select
                                labelId="eventRoomLabel"
                                size="small"
                                variant="standard"
                                id="room"
                                value={values.room}
                                label="Salle"
                                onChange={(e) => {
                                    setFieldValue('room', e.target.value);
                                }}
                            >
                                {roomsList.map((item, index) => (
                                    <MenuItem value={item.id} key={index} id={`roomValue-${item.id}`}>
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="eventRoomLabel" size="small">
                                Saison
                            </InputLabel>
                            <Select
                                labelId="eventSeasonLabel"
                                size="small"
                                id="season"
                                variant="standard"
                                value={values.season}
                                label="Saison"
                                onChange={(e) => {
                                    setFieldValue('season', e.target.value);
                                }}
                            >
                                {seasonsList.map((item, index) => (
                                    <MenuItem value={item.id} key={index} id={`seasonValue-${item.id}`}>
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>

            <Component.CmtFormBlock title="Catégories">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <Component.EventParentCategoryPartForm values={values} categoriesList={categoriesList} setFieldValue={setFieldValue} touched={touched} errors={errors} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ marginTop: 3 }}>
                            <InputLabel id="eventCategoriesLabel" size="small">
                                Tags
                            </InputLabel>
                            <Select
                                labelId="eventTagsLabel"
                                id="eventTags"
                                variant="standard"
                                value={values.tags}
                                size="small"
                                label="Tags"
                                onChange={(e) => {
                                    setFieldValue('tags', e.target.value);
                                }}
                                multiple
                                renderValue={(selected) => {
                                    let renderName = [];

                                    selected.forEach((elem) => {
                                        const name = tagsList.find((el) => el.id === elem).name;

                                        if (name) {
                                            renderName.push(name);
                                        }
                                    });

                                    return renderName.join(', ');
                                }}
                            >
                                {tagsList?.map((item, index) => (
                                    <MenuItem value={item.id} key={index} id={`eventTagsValue-${item.id}`}>
                                        <Checkbox checked={values.tags.indexOf(item.id) > -1} />
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Component.CmtFormBlock>
        </>
    );
};
