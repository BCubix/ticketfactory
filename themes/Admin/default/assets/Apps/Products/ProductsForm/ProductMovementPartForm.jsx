import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { Component } from '@/AdminService/Component';

export const ProductMovementPartForm = ({ values, handleChange, handleBlur, touched, errors, setFieldTouched, setFieldValue, productCategoriesList, editMode }) => {
    const [inputValue, setInputValue] = useState(0);
    const [initialStock] = useState(values.stock  ? values.stock : 0);

    useEffect(() => {
        if (initialStock === 0) {
            setFieldValue("stock", 0);
            setFieldValue("stock-modification", 0);
        }
    }, [setFieldValue]);

    const handleModification = (e) => {
        const newValue = e.target.value;

        setInputValue(newValue);
        setFieldValue("stock", Number(initialStock) + Number(newValue));
    };

    const handleStock = (e) => {
        const newValue = e.target.value ;
        
        const updatedModification = 0 + (Number(newValue) - initialStock);
        setInputValue(updatedModification);
        setFieldValue("stock", Number(newValue));
    }


    return (
                <Grid container spacing={4}>
                
                    <Grid item xs={12} md={4}>
                        <Component.CmtTextField
                            value={values.stock}
                            onChange={handleStock}
                            onBlur={handleBlur}
                            label="Stock actuel"
                            name="stock"
                            error={touched.stock && errors.stock}
                            required
                            type="number"
                        />
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Component.CmtTextField
                            value={inputValue}
                            onChange={handleModification}
                            onBlur={handleBlur}
                            label="Modification"
                            name="stock-modification"
                            type="number"
                        />
                    </Grid>

                </Grid>
    );
};
