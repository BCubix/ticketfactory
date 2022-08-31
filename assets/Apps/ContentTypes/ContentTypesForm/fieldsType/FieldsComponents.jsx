import { MenuItem, Select, Switch } from '@mui/material';
import moment from 'moment';
import React from 'react';
import { CmtDatePicker } from '../../../../Components/CmtDatePicker/CmtDatePicker';
import { CmtDateTimePicker } from '../../../../Components/CmtDateTimePicker/CmtDateTimePicker';
import { CmtTextField } from '../../../../Components/CmtTextField/CmtTextField';
import { CmtTimePicker } from '../../../../Components/CmtTimePicker/CmtTimePicker';
import { ContentTypeFieldArrayForm } from '../FieldArray/ContentTypeFieldArrayForm';

export const FIELDS_FORM_TYPE = [
    {
        type: 'text',
        component: ({ value, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
            />
        ),
    },
    {
        type: 'textarea',
        component: ({ value, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                multiline
                rows={4}
            />
        ),
    },
    {
        type: 'boolean',
        component: ({ value, name, setFieldValue }) => (
            <Switch
                checked={Boolean(value)}
                onChange={(e) => {
                    setFieldValue(name, e.target.checked);
                }}
            />
        ),
    },
    {
        type: 'number',
        component: ({ value, onChange, onBlur, name, error }) => (
            <CmtTextField
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                name={name}
                error={error}
                type="number"
            />
        ),
    },
    {
        type: 'select',
        component: ({ value, setFieldValue, onBlur, name, error, list, multiple }) => (
            <Select
                value={value}
                fullWidth
                size="small"
                onChange={(e) => {
                    setFieldValue(name, e.target.value);
                }}
                onBlur={onBlur}
                name={name}
                error={error}
                multiple={multiple}
            >
                {list?.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        {item}
                    </MenuItem>
                ))}
            </Select>
        ),
    },
    {
        type: 'date',
        component: ({ value, setFieldTouched, setFieldValue, name, error }) => (
            <CmtDatePicker
                fullWidth
                value={value}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
            />
        ),
    },
    {
        type: 'dateTime',
        component: ({ value, setFieldTouched, setFieldValue, name, error }) => (
            <CmtDateTimePicker
                fullWidth
                value={value}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('YYYY-MM-DD HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
            />
        ),
    },
    {
        type: 'time',
        component: ({ value, setFieldTouched, setFieldValue, name, error }) => (
            <CmtTimePicker
                fullWidth
                value={value}
                setValue={(newValue) => {
                    setFieldValue(name, moment(newValue).format('HH:mm'));
                }}
                onTouched={setFieldTouched}
                name={name}
                error={error}
            />
        ),
    },
    {
        type: 'groupFields',
        component: ({
            value,
            touched,
            handleChange,
            handleBlur,
            setFieldTouched,
            setFieldValue,
            name,
            error,
            prefixName,
        }) => (
            <ContentTypeFieldArrayForm
                values={value}
                errors={error}
                touched={touched}
                handleChange={handleChange}
                handleBlur={handleBlur}
                setFieldValue={setFieldValue}
                setFieldTouched={setFieldTouched}
                prefixName={`${prefixName}${name}.`}
            />
        ),
    },
];
