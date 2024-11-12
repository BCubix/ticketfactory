import React, { useEffect, useState } from 'react';

import { CardContent, Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

export const ProductStockMovementList = ({initValues}) => {
    const movements = [...(initValues?.productStockMovements || [])].reverse();
    
    return (
                <CardContent>
                    {movements && movements.length > 0 ? (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Créé à</TableCell>
                                    <TableCell>Quantité</TableCell>
                                    <TableCell>Référence</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movements.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{item.createdAt}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item?.order?.reference || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <Typography>Aucune donnée de mouvement de stock disponible pour l'instant.</Typography>
                    )}
                </CardContent>
    );
};
