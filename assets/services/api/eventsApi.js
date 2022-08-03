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
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('eventCategory', data.eventCategory);
            formData.append('room', data.room);
            formData.append('season', data.season);

            data.eventDates.forEach((date, index) => {
                formData.append(`eventDates[${index}][eventDate]`, date.eventDate);
            });

            data.eventPrices.forEach((price, index) => {
                formData.append(`eventPrices[${index}][name]`, price.name);
                formData.append(`eventPrices[${index}][annotation]`, price.annotation);
                formData.append(`eventPrices[${index}][price]`, price.price);
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
