import React from 'react';
import ExtensionIcon from '@mui/icons-material/Extension';
import { Avatar } from '@mui/material';
import { checkArray, checkObject, checkString } from '@Services/utils/check';
import { Component } from '@/AdminService/Component';

const keys = ['name', 'label', 'width', 'type', 'sortable', 'renderFunction'];

const TableColumnObj = {
    CategoriesList: [
        { name: 'id', label: 'ID', width: '10%' },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%' },
        { name: 'name', label: 'Nom', width: '50%' },
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
    ContentsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '20%', sortable: true },
        { name: 'contentType.name', label: 'Type de contenu', width: '30%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    ContentTypesList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '70%', sortable: true },
    ],
    EventsList: [
        { name: 'id', label: 'ID', width: '5%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'mainCategory.name', label: 'Catégorie', width: '10%', sortable: true },
        { name: 'room.name', label: 'Salle', width: '10%', sortable: true },
        { name: 'season.name', label: 'Saison', width: '10%', sortable: true },
        { name: 'tags.0.name', label: 'Tags', width: '10%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '10%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
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
        { name: 'author', label: 'Auteur', width: '10%' },
        { name: 'description', label: 'Description', width: '58%' },
    ],
    PageBlocksList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '60%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    PagesList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'title', label: 'Titre', width: '30%', sortable: true },
        { name: 'slug', label: 'Url', width: '20%' },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    RedirectionsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'redirectType', label: 'Type de redirection', width: '20%', sortable: true },
        { name: 'redirectFrom', label: 'Redirigé depuis', width: '25%', sortable: true },
        { name: 'redirectTo', label: 'Redirigé vers', width: '25%', sortable: true },
    ],
    RoomsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '20%', sortable: true },
        { name: 'seatsNb', label: 'Nombre de places', width: '15%', sortable: true },
        { name: 'area', label: 'Superficie', width: '15%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    SeasonsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
        { name: 'lang.isoCode', label: 'Langue', width: '15%', renderFunction: (item) => <Component.CmtDisplayFlag item={item} /> },
    ],
    TagsList: [
        { name: 'id', label: 'ID', width: '10%', sortable: true },
        { name: 'active', label: 'Activé ?', type: 'bool', width: '10%', sortable: true },
        { name: 'name', label: 'Nom', width: '50%', sortable: true },
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
