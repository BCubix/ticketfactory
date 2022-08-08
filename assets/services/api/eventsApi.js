import moment from 'moment';
import axios from './config';

const eventsApi = {
    getEvents: async () => {
        try {
            const result = await axios.get('/events');

            return { result: true, events: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneEvent: async (id) => {
        try {
            const result = await axios.get(`/events/${id}`);

            return { result: true, event: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createEvent: async (data) => {
        try {
            console.log(data);

            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('room', data.room);
            formData.append('season', data.season);
            formData.append('mainCategory', data.mainCategory);

            data?.eventDateBlocks?.forEach((dateBlock, index) => {
                formData.append(`eventDateBlocks[${index}][name]`, dateBlock.name);

                dateBlock?.eventDates?.forEach((date, ind) => {
                    formData.append(
                        `eventDateBlocks[${index}][eventDates][${ind}][eventDate]`,
                        date.eventDate
                    );
                    formData.append(
                        `eventDateBlocks[${index}][eventDates][${ind}][annotation]`,
                        date.annotation
                    );
                    formData.append(
                        `eventDateBlocks[${index}][eventDates][${ind}][state]`,
                        date.state
                    );
                    formData.append(
                        `eventDateBlocks[${index}][eventDates][${ind}][reportDate]`,
                        date.reportDate
                    );
                });
            });

            data?.eventPriceBlocks?.forEach((priceBlock, index) => {
                formData.append(`eventPriceBlocks[${index}][name]`, priceBlock.name);

                priceBlock?.eventPrices.forEach((price, ind) => {
                    formData.append(
                        `eventPriceBlocks[${index}][eventPrices][${ind}][name]`,
                        price.name
                    );
                    formData.append(
                        `eventPriceBlocks[${index}][eventPrices][${ind}][annotation]`,
                        price.annotation
                    );
                    formData.append(
                        `eventPriceBlocks[${index}][eventPrices][${ind}][price]`,
                        price.price
                    );
                });
            });

            data?.eventCategories?.forEach((category, index) => {
                formData.append(`eventCategories[${index}]`, category);
            });

            data?.tags?.forEach((tag, index) => {
                formData.append(`tags[${index}]`, tag);
            });

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
            formData.append('description', data.description);
            formData.append('eventCategory', data.eventCategory);
            formData.append('room', data.room);
            formData.append('season', data.season);

            data.eventDates.forEach((date, index) => {
                formData.append(
                    `eventDates[${index}][eventDate]`,
                    moment(date.eventDate).format('YYYY-MM-DD HH:mm')
                );
            });

            data.eventPrices.forEach((price, index) => {
                formData.append(`eventPrices[${index}][name]`, price.name);
                formData.append(`eventPrices[${index}][annotation]`, price.annotation);
                formData.append(`eventPrices[${index}][price]`, price.price);
            });

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
};

export default eventsApi;
