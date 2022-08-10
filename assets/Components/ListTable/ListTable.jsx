import {
    Fab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
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
export const ListTable = ({ table, list, onDelete = null, onEdit = null, onClick = null }) => {
    if (!table || table?.length === 0 || !list || list.length === 0) {
        return <></>;
    }

    return (
        <TableContainer>
            <Table sx={{ minWidth: 650, marginTop: 5 }}>
                <TableHead>
                    <TableRow>
                        {table.map((element, index) => (
                            <TableCell key={index} sx={{ width: element.width || 'auto' }}>
                                {element.label}
                            </TableCell>
                        ))}
                        {(onDelete !== null || onEdit !== null) && <TableCell>Actions</TableCell>}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {list?.map((item, index) => (
                        <TableRow
                            key={index}
                            onClick={() => {
                                if (onClick) {
                                    onClick(item?.id);
                                }
                            }}
                            sx={
                                onClick
                                    ? {
                                          cursor: 'pointer',
                                      }
                                    : {}
                            }
                        >
                            {table.map((tableItem, ind) => (
                                <TableCell component="th" scope="row" key={ind}>
                                    <RenderFunction item={item} tableItem={tableItem} />
                                </TableCell>
                            ))}
                            {(onDelete !== null || onEdit !== null) && (
                                <TableCell component="th" scope="row">
                                    <Fab
                                        sx={{ marginInline: 1 }}
                                        color="primary"
                                        size="small"
                                        aria-label="Modifier"
                                        onClick={(e) => {
                                            e.stopPropagation();
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(item.id);
                                        }}
                                    >
                                        <DeleteIcon />
                                    </Fab>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

const RenderFunction = ({ item, tableItem }) => {
    if (tableItem.renderFunction) {
        return tableItem.renderFunction(item);
    }

    if (tableItem.type === 'bool') {
        let result = objectResolver(tableItem.name, item);

        if (result === null) {
            return '';
        }

        return (
            <Typography component="p" variant="body1">
                {result ? 'Oui' : 'Non'}
            </Typography>
        );
    }

    return (
        <Typography component="p" variant="body1">
            {objectResolver(tableItem.name, item)}
        </Typography>
    );
};
