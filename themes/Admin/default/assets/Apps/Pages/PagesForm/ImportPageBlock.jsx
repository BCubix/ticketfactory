import React from 'react';
import { FormControlLabel, Grid, Radio, RadioGroup, Typography } from '@mui/material';
import { Box } from '@mui/system';

export const ImportPageBlock = ({ pageBlocks, selectedBlock, setSelectedBlock }) => {
    return (
        <Box>
            <RadioGroup row name="importBlock" value={selectedBlock} onChange={(event) => setSelectedBlock(Number(event.target.value))}>
                <Grid container spacing={4}>
                    {pageBlocks?.map((block, index) => (
                        <Grid item xs={12} sm={4} md={3} xl={2} key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Box
                                sx={{
                                    height: '4rem',
                                    width: '100%',
                                    border: (theme) => `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography variant="body2">{block.name}</Typography>
                            </Box>
                            <FormControlLabel value={index} sx={{ marginRight: 0 }} control={<Radio />} />
                        </Grid>
                    ))}
                </Grid>
            </RadioGroup>
        </Box>
    );
};
