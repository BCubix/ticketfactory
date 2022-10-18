import axios from './config';

const roomsApi = {
    getRooms: async () => {
        try {
            const result = await axios.get('/rooms');

            return { result: true, rooms: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    getOneRoom: async (id) => {
        try {
            const result = await axios.get(`/rooms/${id}`);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    createRoom: async (data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('area', data.area);
            formData.append('seatsNb', data.seatsNb);

            data.seatingPlans.forEach((plan, index) => {
                formData.append(`seatingPlans[${index}][name]`, plan.name);
            });

            const result = await axios.post('/rooms', formData);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    editRoom: async (id, data) => {
        try {
            let formData = new FormData();

            formData.append('active', data.active ? 1 : 0);
            formData.append('name', data.name);
            formData.append('area', data.area);
            formData.append('seatsNb', data.seatsNb);

            data.seatingPlans.forEach((plan, index) => {
                formData.append(`seatingPlans[${index}][name]`, plan.name);
            });

            const result = await axios.post(`/rooms/${id}`, formData);

            return { result: true, room: result.data };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    deleteRoom: async (id) => {
        try {
            await axios.delete(`/rooms/${id}`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },

    duplicateRoom: async (id) => {
        try {
            await axios.post(`/rooms/${id}/duplicate`);

            return { result: true };
        } catch (error) {
            return { result: false, error: error?.response?.data };
        }
    },
};

export default roomsApi;
