import React from 'react';

import { emphasize, TableCell, TableRow } from '@mui/material';
import { ListTableCellButtons } from './ListTableCellButtons';
import { RenderCellFunction } from './RenderCellFunction';

import { Component } from "@/AdminService/Component";

export const ListTableBodyLine = ({
    item,
    index,
    onClick,
    table,
    onDelete,
    onEdit,
    onRemove,
    onSelect,
    onActive,
    onDisable,
    onDragEnd,
    disableDeleteFunction,
    contextualMenu,
    themeId,
    handleClick,
    expendElementTranslation,
    setExpendElementTranslation,
    isTranslated = false,
}) => {
    return (
        <>
            <Component.CmtDragAndDropTableBodyRow
                onDragEnd={onDragEnd}
                index={index}
                tableRowProps={{
                    id: `tableElement-${item.id}`,
                    onClick: () => {
                        if (onClick) {
                            onClick(item?.id);
                        }
                    },
                    sx: { cursor: onClick && 'pointer', backgroundColor: isTranslated && '#E1E1E1' }
                }}
            >
                {table.map((tableItem, ind) => (
                    <TableCell component="th" scope="row" key={ind}>
                        <RenderCellFunction item={item} tableItem={tableItem} />
                    </TableCell>
                ))}

                <ListTableCellButtons
                    item={item}
                    onDelete={onDelete}
                    onEdit={onEdit}
                    onRemove={onRemove}
                    onSelect={onSelect}
                    onActive={onActive}
                    onDisable={onDisable}
                    disableDeleteFunction={disableDeleteFunction}
                    contextualMenu={contextualMenu}
                    themeId={themeId}
                    handleClick={handleClick}
                    expendElementTranslation={expendElementTranslation}
                    setExpendElementTranslation={setExpendElementTranslation}
                />
            </Component.CmtDragAndDropTableBodyRow>

            {item?.translatedElements?.length > 0 &&
                expendElementTranslation?.id === item?.id &&
                item?.translatedElements?.map((it, ind) => (
                    <ListTableBodyLine
                        item={it}
                        key={ind}
                        index={index}
                        table={table}
                        onClick={onClick}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onRemove={onRemove}
                        onSelect={onSelect}
                        onActive={onActive}
                        onDisable={onDisable}
                        onDragEnd={onDragEnd}
                        disableDeleteFunction={disableDeleteFunction}
                        contextualMenu={contextualMenu}
                        themeId={themeId}
                        handleClick={handleClick}
                        expendElementTranslation={expendElementTranslation}
                        setExpendElementTranslation={setExpendElementTranslation}
                        isTranslated
                    />
                ))}
        </>
    );
};
