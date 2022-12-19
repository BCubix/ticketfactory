import React from "react";
import { Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Component } from "@/AdminService/Component";

export const HookTable = ({ hookName, modules, setDeleteDialog}) => {
    return (
        <>
            <Component.CmtFormBlock title={hookName} sx={{ mt: 5 }} paddingContent={0}>
                <TableContainer sx={{ mt: 0 }}>
                    <Table sx={{ minWidth: 650 }}>
                        <Component.HookTableBody
                            hookName={hookName}
                            modules={modules}
                            setDeleteDialog={setDeleteDialog}
                        />
                    </Table>
                </TableContainer>
            </Component.CmtFormBlock>
        </>
    );
};
