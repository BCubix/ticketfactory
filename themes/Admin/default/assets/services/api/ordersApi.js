import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';

import { Constant } from '@/AdminService/Constant';

const DEFAULT_PATH = '/orders';

var controller = null;

const FILTERS_SORT_TAB = [
    {
        name: 'active',
        transformFilter: (params, sort) => {
            params['filters[active]'] = sort ? '1' : '0';
        },
    },
    { name: 'orderId', sortName: 'filters[orderId]' },
    { name: 'date', sortName: 'filters[date]' },
    { name: 'clientName', sortName: 'filters[clientName]' },
    { name: 'limit', sortName: 'filters[limit]' },
    {
        name: 'sort',
        transformFilter: (params, sort) => {
            const splitSort = sort?.split(' ');

            params['filters[sortField]'] = splitSort[0];
            params['filters[sortOrder]'] = splitSort[1];
        },
    },
];

const MOCK_UP = [
    {
        id: 1,
        reference: 'HDKZPF4S',
        active: true,
        status: {
            id: 1,
            name: 'Validé',
            keyword: 'validated',
            color: '#D7F5B1',
        },
        customer: {
            createdAt: '2023-04-24 11:23:12',
            updatedAt: '2023-04-24 11:23:12',
            active: true,
            id: 2,
            email: 'bryanbouillot@gmail.com',
            firstName: 'Bryan',
            lastName: 'BOUILLOT',
            civility: 'M.',
        },
        cart: {
            createdAt: '2023-04-24 11:58:11',
            updatedAt: '2023-04-24 11:58:15',
            active: true,
            id: 1,
            total: 7.2,
            customer: {
                createdAt: '2023-04-24 11:23:12',
                updatedAt: '2023-04-24 11:23:12',
                active: true,
                id: 2,
                email: 'bryanbouillot@gmail.com',
                firstName: 'Bryan',
                lastName: 'BOUILLOT',
                civility: 'M.',
            },
            cartRows: [
                {
                    id: 1,
                    eventId: {
                        createdAt: '2023-02-07 16:24:21',
                        updatedAt: '2023-03-29 11:33:20',
                        active: true,
                        id: 1,
                        name: 'Le médecin malgré lui',
                        slug: 'le-medecin-malgre-luidd',
                        chapo: 'Le Médecin malgré lui est une pièce de théâtre de Molière en trois actes de respectivement 5, 5 et 11 scènes en prose représentée pour la première fois le 6 août 1666 au Théâtre du Palais-Royal, où elle obtint un grand succès.',
                        metaTitle: 'Le médecin malgré lui',
                        metaDescription: null,
                        socialImage: null,
                        fbTitle: 'Le médecin malgré lui',
                        fbDescription: null,
                        twTitle: 'Le médecin malgré lui',
                        twDescription: null,
                    },
                    eventDateId: {
                        id: 1,
                        eventDate: '2023-02-20 20:55:00',
                        state: 'valid',
                        reportDate: null,
                        annotation: null,
                    },
                    eventPriceId: {},
                    seatingPlanId: null,
                    names: ['Le médecin malgré lui'],
                    unitPrice: 18.5,
                    quantity: 2,
                    total: 12.2,
                    vouchers: [
                        {
                            createdAt: '2023-04-26 08:28:52',
                            updatedAt: '2023-04-26 10:24:34',
                            active: true,
                            id: 1,
                            name: 'Réduction de printemps',
                            code: 'KIb9GN',
                            discount: 40,
                            unit: '%',
                            beginDate: '2023-04-30 00:00:00',
                            endDate: '2023-04-30 00:00:00',
                        },
                        {
                            createdAt: '2023-04-26 10:24:27',
                            updatedAt: '2023-04-26 10:24:27',
                            active: true,
                            id: 2,
                            name: 'Réduction spéciale',
                            code: 'QeJG9X',
                            discount: 10,
                            unit: '€',
                            beginDate: null,
                            endDate: null,
                        },
                    ],
                },
            ],
            vouchers: [
                {
                    createdAt: '2023-04-26 11:21:04',
                    updatedAt: '2023-04-26 11:21:04',
                    active: true,
                    id: 3,
                    name: 'Réduction de dernière minute',
                    code: '4oCuSK',
                    discount: 5,
                    unit: '€',
                    beginDate: null,
                    endDate: null,
                },
            ],
        },
    },
];

const ordersApi = {
    getOrders: async (filters) => {
        try {
            return { result: true, orders: MOCK_UP, total: 1 };

            let params = {};

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get(DEFAULT_PATH, {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            return { result: true, orders: result.data.results, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, orders: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getAllOrders: async (filters) => {
        try {
            let params = { 'filters[page]': 0 };

            createFilterParams(filters, FILTERS_SORT_TAB, params);

            const result = await axios.get(DEFAULT_PATH, { params: params });

            return { result: true, orders: result.data?.results, total: result?.data?.total };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneOrder: async (id) => {
        try {
            return { result: true, order: MOCK_UP[0] };
            const result = await axios.get(`${DEFAULT_PATH}/${id}`);

            return { result: true, order: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default ordersApi;
