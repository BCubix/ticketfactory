import {
    Checkbox,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
} from '@mui/material';
import React from 'react';
import { CmtFormBlock } from '../../../Components/CmtFormBlock/CmtFormBlock';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import LightEditor from '../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../Components/Editors/LightEditor/sc.LightEditorFormControl';
import Select from '@mui/material/Select';

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
}) => {
    return (
        <>
            <CmtFormBlock title={'Informations générales'}>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <CmtTextField
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            label="Nom"
                            name="name"
                            error={touched.name && errors.name}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <InputLabel id="description">Description</InputLabel>
                        <LightEditorFormControl>
                            <LightEditor
                                labelId="description"
                                value={values.description}
                                onBlur={() => setFieldTouched('description', true, false)}
                                onChange={(val) => {
                                    setFieldValue('description', val);
                                }}
                            />
                            <FormHelperText error>
                                {touched.description && errors.description}
                            </FormHelperText>
                        </LightEditorFormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="eventRoomLabel" size="small">
                                Salle
                            </InputLabel>
                            <Select
                                labelId="eventRoomLabel"
                                size="small"
                                id="room"
                                value={values.room}
                                label="Salle"
                                onChange={(e) => {
                                    setFieldValue('room', e.target.value);
                                }}
                            >
                                {roomsList.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
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
                                value={values.season}
                                label="Saison"
                                onChange={(e) => {
                                    setFieldValue('season', e.target.value);
                                }}
                            >
                                {seasonsList.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CmtFormBlock>

            <CmtFormBlock title="Catégories">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ marginTop: 3 }}>
                            <InputLabel id="eventCategoriesLabel" size="small">
                                Catégories
                            </InputLabel>
                            <Select
                                labelId="eventCategoriesLabel"
                                id="eventCategories"
                                size="small"
                                value={values.eventCategories}
                                label="Catégories"
                                onChange={(e) => {
                                    setFieldValue('eventCategories', e.target.value);
                                }}
                                multiple
                                renderValue={(selected) => {
                                    let renderName = [];

                                    selected.forEach((elem) => {
                                        const name = categoriesList?.find(
                                            (el) => el.id === elem
                                        )?.name;

                                        if (name) {
                                            renderName.push(name);
                                        }
                                    });

                                    return renderName.join(', ');
                                }}
                            >
                                {categoriesList?.map((item, index) => (
                                    <MenuItem value={item.id} key={index}>
                                        <Checkbox
                                            checked={values.eventCategories.indexOf(item.id) > -1}
                                        />
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <FormControl fullWidth sx={{ marginTop: 3 }}>
                            <InputLabel id="eventCategoriesLabel" size="small">
                                Tags
                            </InputLabel>
                            <Select
                                labelId="eventTagsLabel"
                                id="eventTags"
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
                                    <MenuItem value={item.id} key={index}>
                                        <Checkbox checked={values.tags.indexOf(item.id) > -1} />
                                        <ListItemText>{item.name}</ListItemText>
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </CmtFormBlock>
        </>
    );
};
