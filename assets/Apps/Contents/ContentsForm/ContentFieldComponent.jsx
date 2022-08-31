import { Checkbox, FormControlLabel, FormHelperText, InputLabel, Switch } from '@mui/material';
import React from 'react';
import { CmtTextField } from '../../../Components/CmtTextField/CmtTextField';
import LightEditor from '../../../Components/Editors/LightEditor/LightEditor';
import { LightEditorFormControl } from '../../../Components/Editors/LightEditor/sc.LightEditorFormControl';
import { UploadFileContent } from './FieldComponents/UploadFileContent';
import { CirclePicker } from 'react-color';
import { MapContentField } from './FieldComponents/MapContentField';
import { ChoiceListContentField } from './FieldComponents/ChoiceListContentField';
import { RadioButtonContentField } from './FieldComponents/RadioButtonContentField';

export const CONTENT_FIELD_COMPONENT = [
    {
        type: 'text',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'textarea',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                multiline={true}
                rows={3}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'number',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="number"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'email',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="email"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'password',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="password"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'url',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'date',
        component: ({ value, label, setFieldValue, setFieldTouched, name, error, field }) => (
            <CmtDatePicker
                fullWidth
                value={value}
                label={label}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'dateTime',
        component: ({ value, label, setFieldValue, setFieldTouched, name, error, field }) => (
            <CmtDateTimePicker
                fullWidth
                label={label}
                value={value}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'time',
        component: ({ value, label, setFieldValue, setFieldTouched, name, error, field }) => (
            <CmtTimePicker
                fullWidth
                value={value}
                label={label}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'image',
        component: ({ value, label, setFieldValue, setFieldTouched, field, name, error }) => (
            <UploadFileContent
                value={value}
                handleChange={setFieldValue}
                label={label}
                handleBlur={setFieldTouched}
                name={name}
                error={error}
                field={field}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'file',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                label={label}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="file"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'contentEditor',
        component: ({ value, label, setFieldValue, setFieldTouched, name, error, field }) => (
            <>
                <InputLabel id={`${label}-label`}>{label}</InputLabel>
                <LightEditorFormControl>
                    <LightEditor
                        labelId={`${label}-label`}
                        value={value}
                        onBlur={() => setFieldTouched(name, true, false)}
                        onChange={(val) => {
                            setFieldValue(name, val);
                        }}
                        required={field?.options?.required}
                        disabled={field?.options?.disabled}
                    />
                    <FormHelperText error>{error}</FormHelperText>
                </LightEditorFormControl>
            </>
        ),
    },
    {
        type: 'slider',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="file"
                multiple
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'iframe',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'audio/video',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="file"
                multiple
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'map',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <MapContentField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="file"
                multiple
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'color',
        component: ({ value, label, setFieldValue, onBlur, name, error, field }) => (
            <>
                <InputLabel id={`${label}-label`}>{label}</InputLabel>
                <CirclePicker
                    width="100%"
                    value={value}
                    onChange={(newValue) => setFieldValue(name, newValue.hex)}
                    label={label}
                    onBlur={onBlur}
                    name={name}
                    error={error}
                    circleSpacing={8}
                    required={field?.options?.required}
                    disabled={field?.options?.disabled}
                />
            </>
        ),
    },
    {
        type: 'choiceList',
        component: ({ value, label, field, setFieldValue, onBlur, name, error }) => (
            <ChoiceListContentField
                value={value}
                setFieldValue={setFieldValue}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                options={field?.options}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'radioButton',
        component: ({ value, label, field, setFieldValue, onBlur, name, error }) => (
            <RadioButtonContentField
                value={value}
                setFieldValue={setFieldValue}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                options={field?.options}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'checkbox',
        component: ({ value, label, field, setFieldValue, onBlur, name, error }) => (
            <FormControlLabel
                control={<Checkbox />}
                value={value}
                label={label}
                onChange={(e) => setFieldValue(name, e.target.checked)}
                onBlur={onBlur}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                labelPlacement="start"
                sx={{ marginLeft: 0 }}
            />
        ),
    },
    {
        type: 'true/false',
        component: ({ value, label, field, setFieldValue, onBlur, name, error }) => (
            <FormControlLabel
                control={<Switch />}
                value={value}
                label={label}
                onChange={(e) => setFieldValue(name, e.target.checked)}
                onBlur={onBlur}
                name={name}
                error={error}
                required={field?.options?.required}
                disabled={field?.options?.disabled}
                labelPlacement="start"
                sx={{ marginLeft: 0 }}
            />
        ),
    },
    {
        type: 'externalLink',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
                required={field?.options?.required}
                disabled={field?.options?.disabled}
            />
        ),
    },
    {
        type: 'contentLink',
        component: ({ value, label, onChange, onBlur, name, error, field }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
            />
        ),
    },
    {
        type: 'eventLink',
        component: ({ value, label, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                label={label}
                name={name}
                error={error}
                type="url"
            />
        ),
    },
    {
        type: 'pageLink',
        component: ({ value, label, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
            />
        ),
    },
    {
        type: 'categoryLink',
        component: ({ value, label, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
            />
        ),
    },
    {
        type: 'tagLink',
        component: ({ value, label, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                label={label}
                onBlur={onBlur}
                name={name}
                error={error}
                type="url"
            />
        ),
    },
];
