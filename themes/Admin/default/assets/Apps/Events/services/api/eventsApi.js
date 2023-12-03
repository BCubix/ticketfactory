import moment from 'moment';

import { Constant } from '@/AdminService/Constant';

import axios from '@Services/api/config';
import { createFilterParams } from '@Services/utils/createFilterParams';
import { copyData } from '@Services/utils/copyData';
import { changeSlug } from '@Services/utils/changeSlug';
import { sortTranslatedObject } from '@Services/utils/translationUtils';
import { getSeoFormData } from '@Apps/SEO/services/api/seoApi';
import { Crud } from '@/AdminService/Crud';

var controller = null;

const eventsApi = {
    getEvents: async (filters) => {
        try {
            let params = {};

            createFilterParams(filters, Crud?.events?.list?.filtersData, params);

            if (null !== controller) {
                controller.abort();
            }

            controller = new AbortController();

            const result = await axios.get('/events', {
                params: params,
                signal: controller.signal,
            });

            controller = null;

            const translatedList = sortTranslatedObject(result.data?.results);

            return { result: true, events: translatedList, total: result?.data?.total };
        } catch (error) {
            if (error?.code === Constant.CANCELED_REQUEST_ERROR_CODE) {
                return { result: true, events: [], total: 0 };
            }

            return { result: false, error: error?.response?.data };
        }
    },

    getOneEvent: async (id) => {
        try {
            const result = await axios.get(`/events/${id}`);
            const data = copyData(result?.data);

            return { result: true, event: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createEvent: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('chapo', data.chapo);
            formData.append('description', data.description);
            formData.append('room', data.room);
            formData.append('season', data.season);
            formData.append('mainCategory', data.mainCategory);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang || '');
            formData.append('languageGroup', data.languageGroup || '');
            formData.append('ticketingId', data.ticketingId);
            formData.append('useThirdPartyTicketing', data.useThirdPartyTicketing);
            formData.append('thirdPartyTicketingUrl', data.thirdPartyTicketingUrl);
            formData.append('eventLength', data.eventLength);

            data?.eventDateBlocks?.forEach((dateBlock, index) => {
                formData.append(`eventDateBlocks[${index}][name]`, dateBlock.name);
                formData.append(`eventDateBlocks[${index}][lang]`, dateBlock.lang || '');
                formData.append(`eventDateBlocks[${index}][languageGroup]`, dateBlock.languageGroup || '');

                dateBlock?.eventDates?.forEach((date, ind) => {
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][eventDate]`, moment(date.eventDate).format('YYYY-MM-DD HH:mm'));
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][annotation]`, date.annotation);
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][state]`, date.state);
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][lang]`, date.lang || '');
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][languageGroup]`, date.languageGroup || '');

                    if (date.reportDate) {
                        formData.append(`eventDateBlocks[${index}][eventDates][${ind}][reportDate]`, moment(date.reportDate).format('YYYY-MM-DD HH:mm'));
                    }
                });
            });

            data?.eventPriceBlocks?.forEach((priceBlock, index) => {
                formData.append(`eventPriceBlocks[${index}][name]`, priceBlock.name);
                formData.append(`eventPriceBlocks[${index}][lang]`, priceBlock.lang || '');
                formData.append(`eventPriceBlocks[${index}][languageGroup]`, priceBlock.languageGroup || '');

                priceBlock?.eventPrices.forEach((price, ind) => {
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][name]`, price.name);
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][annotation]`, price.annotation);
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][price]`, price.price);
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][lang]`, price.lang || '');
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][languageGroup]`, price.languageGroup || '');
                });
            });

            data?.eventCategories?.forEach((category, index) => {
                formData.append(`eventCategories[${index}]`, category);
            });

            data?.tags?.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

            data.eventMedias?.forEach((eventMedia, index) => {
                formData.append(`eventMedias[${index}][media]`, eventMedia.id);
                formData.append(`eventMedias[${index}][position]`, eventMedia.position || index + 1);
            });

            data?.featureLinks?.forEach((featureLink, index) => {
                formData.append(`featureLinks[${index}][feature]`, featureLink.feature || '');
                formData.append(`featureLinks[${index}][featureValue]`, featureLink.featureValue || '');
                formData.append(`featureLinks[${index}][featureValueRaw]`, featureLink.featureValueRaw || '');
            })

            getSeoFormData(formData, data);

            const result = await axios.post('/events', formData);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editEvent: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('chapo', data.chapo);
            formData.append('description', data.description);
            formData.append('room', data.room);
            formData.append('season', data.season);
            formData.append('mainCategory', data.mainCategory);
            formData.append('slug', changeSlug(data.slug));
            formData.append('lang', data.lang);
            formData.append('languageGroup', data.languageGroup);
            formData.append('ticketingId', data.ticketingId);
            formData.append('useThirdPartyTicketing', data.useThirdPartyTicketing);
            formData.append('thirdPartyTicketingUrl', data.thirdPartyTicketingUrl);
            formData.append('eventLength', data.eventLength);

            data?.eventDateBlocks?.forEach((dateBlock, index) => {
                formData.append(`eventDateBlocks[${index}][name]`, dateBlock.name);

                dateBlock?.eventDates?.forEach((date, ind) => {
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][eventDate]`, moment(date.eventDate).format('YYYY-MM-DD HH:mm'));
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][annotation]`, date.annotation);
                    formData.append(`eventDateBlocks[${index}][eventDates][${ind}][state]`, date.state);

                    if (date.reportDate) {
                        formData.append(`eventDateBlocks[${index}][eventDates][${ind}][reportDate]`, moment(date.reportDate).format('YYYY-MM-DD HH:mm'));
                    }
                });
            });

            data?.eventPriceBlocks?.forEach((priceBlock, index) => {
                formData.append(`eventPriceBlocks[${index}][name]`, priceBlock.name);

                priceBlock?.eventPrices.forEach((price, ind) => {
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][name]`, price.name);
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][annotation]`, price.annotation);
                    formData.append(`eventPriceBlocks[${index}][eventPrices][${ind}][price]`, price.price);
                });
            });

            data?.eventCategories?.forEach((category, index) => {
                formData.append(`eventCategories[${index}]`, category);
            });

            data?.tags?.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

            data.eventMedias?.forEach((eventMedia, index) => {
                formData.append(`eventMedias[${index}][media]`, eventMedia.id);
                formData.append(`eventMedias[${index}][position]`, eventMedia.position || index + 1);
            });

            data?.featureLinks?.forEach((featureLink, index) => {
                formData.append(`featureLinks[${index}][feature]`, featureLink.feature || '');
                formData.append(`featureLinks[${index}][featureValue]`, featureLink.featureValue || '');
                formData.append(`featureLinks[${index}][featureValueRaw]`, featureLink.featureValueRaw || '');
            })

            getSeoFormData(formData, data);

            const result = await axios.post(`/events/${id}`, formData);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteEvent: async (id) => {
        try {
            await axios.delete(`/events/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateEvent: async (id) => {
        try {
            await axios.post(`/events/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getTranslated: async (id, languageId) => {
        try {
            const result = await axios.get(`/events/${id}/translated/${languageId}`);
            const data = copyData(result?.data);

            return { result: true, event: data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default eventsApi;
