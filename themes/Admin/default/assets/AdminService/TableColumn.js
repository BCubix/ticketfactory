import React from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import { Avatar, Chip, Typography } from '@mui/material';
import { checkArray, checkObject, checkString } from '@Services/utils/check';
import { Component } from '@/AdminService/Component';

const keys = ['name', 'label', 'width', 'type', 'sortable', 'renderFunction'];

const TableColumnObj = {
    CategoriesList: [
        { name: 'id', label: 'ID', width: '10%' },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '45%' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    MediaCategoriesList: [
        { name: 'id', label: 'ID', width: '10%' },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '25%' },
        { name: 'shortDescription', label: 'Description courte', width: '25%' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    ContactRequestsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Gérée ?', type: 'bool', width: '10%', sortable: true },
        { name: 'firstName', label: 'Prénom', width: '10%', sortable: true },
        { name: 'lastName', label: 'Nom', width: '10%', sortable: true },
        { name: 'phone', label: 'Téléphone', width: '20%', sortable: true },
        { name: 'email', label: 'Email', width: '20%', sortable: true },
        { name: 'subject', label: 'Objet', width: '10%', sortable: true },
    ],
    ContentTypesList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '70%', sortable: true },
    ],
    ImageFormatsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'themeUse', label: 'Utilisé par le thème principal ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '30%', sortable: true },
        { name: 'width', label: 'Largeur', width: '15%', sortable: true },
        { name: 'height', label: 'Hauteur', width: '15%', sortable: true },
    ],
    ModulesList: [
        {
            label: 'Logo',
            width: '7%',
            renderFunction: (item) => {
                if (item.logoUrl) {
                    try {
                        return <Avatar src={item.logoUrl} />;
                    } catch (e) {}
                }
                return (
                    <Avatar>
                        <ExtensionIcon />
                    </Avatar>
                );
            },
        },
        { name: 'displayName', label: 'Nom', width: '10%' },
        { name: 'version', label: 'Version', width: '5%' },
        { name: 'author.name', label: 'Auteur', width: '10%' },
        { name: 'description', label: 'Description', width: '58%' },
    ],
    PageBlocksList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '60%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    UserList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'firstName', label: 'Prénom', width: '15%', sortable: true },
        { name: 'lastName', label: 'Nom', width: '15%', sortable: true },
        { name: 'email', label: 'Adresse Email', width: '20%', sortable: true },
        { name: 'roles', label: 'Rôle', width: '20%', sortable: true },
    ],

    LanguagesList: [
        { name: 'id', label: 'ID', width: '10%' },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '40%' },
        { name: 'isoCode', label: 'Code ISO', width: '30%' },
    ],
};

/**
 * TableColumn's getter.
 */
export const TableColumn = new Proxy(TableColumnObj, {
    get(target, key, receiver) {
        if (!(key in target)) {
            throw new Error(`${key} must be in TableColumn.`);
        }

        return Reflect.get(target, key, receiver);
    },
});

/**
 * TableColumn's setter.
 *
 * @param  {string}  name
 * @param  {Array}   tableColumn
 *
 * @throws {Error} Parameters are not corresponded of type script.
 */
export function setTableColumn(name, tableColumn = []) {
    checkString(name);
    checkArray(tableColumn);

    tableColumn.forEach((obj) => {
        checkObject(obj);

        Object.keys(obj).forEach((key) => {
            if (!keys.find((keyRule) => keyRule === key)) {
                throw new Error(`${key} must be in TableColumn's keys.`);
            }
        });
    });

    TableColumnObj[name] = tableColumn;
}
