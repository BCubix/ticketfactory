import React from 'react';
import { Component } from '@/AdminService/Component';
import { Grid } from '@mui/material';

export const CmtDisplayBlocks = ({ blocks, ...inheritedProps }) => {
    return (
        <>
            {blocks.map((block, index) => {
                const { component: CmtBlock, ...props } = block;

                if (CmtBlock) {
                    return <CmtBlock key={index} {...inheritedProps} {...props} />;
                }

                const { keyId, title, spacing, fields, ...blockProps } = block;

                return (
                    <Component.CmtFormBlock key={index} title={title} {...blockProps}>
                        <Grid container spacing={spacing ? spacing : 4}>
                            <Component.CmtDisplayFields fields={fields} {...inheritedProps} />
                        </Grid>
                    </Component.CmtFormBlock>
                );
            })}
        </>
    );
};
