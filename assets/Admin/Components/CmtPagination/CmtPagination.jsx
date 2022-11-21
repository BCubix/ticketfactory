import React from 'react';
import { Box } from '@mui/system';
import { MenuItem, Pagination, Select, Typography } from '@mui/material';

export const CmtPagination = ({ page, total, limit, setPage, setLimit, length = 0 }) => {
    const nbPage = Math.floor(total / limit) + (total % limit > 0 ? 1 : 0);

    return (
        <Box display={'flex'} justifyContent="space-between" alignItems="center" mt={5}>
            <Typography>
                {(page - 1) * limit + 1} - {(page - 1) * limit + length} sur {total} (page {page} /{' '}
                {nbPage})
            </Typography>
            <Pagination
                count={nbPage}
                boundaryCount={1}
                siblingCount={1}
                page={page}
                onChange={(e, newValue) => {
                    setPage(newValue);
                }}
            />

            <Box display="flex">
                <Select
                    variant="standard"
                    size="small"
                    value={limit}
                    onChange={(e) => setLimit(e.target.value)}
                    sx={{ marginInline: 2 }}
                >
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    <MenuItem value={100}>100</MenuItem>
                </Select>
                <Typography>résultats par page</Typography>
            </Box>
        </Box>
    );
};
