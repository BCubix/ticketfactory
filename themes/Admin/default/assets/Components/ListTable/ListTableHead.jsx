import React from 'react';
import { TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';

export const ListTableHead = ({ table, filters, changeFilters, displayAction, onDragEnd }) => {
    const field = filters?.sort ? filters?.sort?.split(' ')[0] : '';
    const order = filters?.sort ? filters?.sort?.split(' ')[1] : '';

    const handleSortClick = (newField) => {
        if (!changeFilters) {
            return;
        }

        let newOrder = '';

        if (field === newField) {
            newOrder = order === 'ASC' ? 'DESC' : 'ASC';
        } else {
            newOrder = order;
        }

        changeFilters({ ...filters, sort: `${newField} ${newOrder}` });
    };

    return (
        <TableHead>
            <TableRow>
                {onDragEnd && <TableCell sx={{ width: '1%' }}></TableCell>}
                {table.map((element, index) => (
                    <TableCell key={index} sx={{ width: element.width || 'auto' }}>
                        {element.sortable ? (
                            <TableSortLabel active={element.name === field} direction={order.toLowerCase() || 'asc'} onClick={() => handleSortClick(element.name)}>
                                {element.label}
                            </TableSortLabel>
                        ) : (
                            element.label
                        )}
                    </TableCell>
                ))}
                {displayAction && <TableCell sx={{ width: '15%' }}>Actions</TableCell>}
            </TableRow>
        </TableHead>
    );
};
