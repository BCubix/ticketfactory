import {
    Fab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import { objectResolver } from '../../services/utils/objectResolver';

/**
 *
 * @param {table}
 * [
 *  {
 *      name: variable name,
 *      label: header column name
 *  }
 * ]
 *
 * @param {list}
 * [
 *  {
 *      variable: value,
 *  }
 * ]
 *
 * @returns
 */
export const ListTable = ({ table, list, onDelete, onEdit }) => {
    if (!table || table?.length === 0 || !list || list.length === 0) {
        return <></>;
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 5 }}>
                <TableHead>
                    <TableRow>
                        {table.map((element, index) => (
                            <TableCell key={index}>{element.label}</TableCell>
                        ))}
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list?.map((item, index) => (
                        <TableRow key={index}>
                            {table.map((tableItem, ind) => (
                                <TableCell component="th" scope="row" key={ind}>
                                    {tableItem.type === 'bool'
                                        ? item[tableItem.name]
                                            ? 'Oui'
                                            : 'Non'
                                        : objectResolver(tableItem.name, item)}
                                </TableCell>
                            ))}
                            <TableCell component="th" scope="row">
                                <Fab
                                    sx={{ marginInline: 1 }}
                                    color="primary"
                                    size="small"
                                    aria-label="Modifier"
                                    onClick={() => {
                                        onEdit(item.id);
                                    }}
                                >
                                    <EditIcon />
                                </Fab>

                                <Fab
                                    sx={{ marginInline: 1 }}
                                    color="error"
                                    size="small"
                                    aria-label="Supprimer"
                                    onClick={() => {
                                        onDelete(item.id);
                                    }}
                                >
                                    <DeleteIcon />
                                </Fab>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
